(() => {
  const buttons = document.querySelectorAll('[data-desktop-download]');
  const status = document.querySelector('[data-desktop-download-status]');
  if (!buttons.length || !status) return;

  const release = '1.18.01';
  const folder = `downloads/desktop-${release}`;
  const filename = `SevenTask-Calculator-Setup-${release}.exe`;

  buttons.forEach(button => button.addEventListener('click', async event => {
    event.preventDefault();
    if ([...buttons].some(item => item.dataset.busy === 'true')) return;
    buttons.forEach(item => {
      item.dataset.busy = 'true';
      item.setAttribute('aria-busy', 'true');
    });

    let fileHandle = null;
    try {
      if (window.showSaveFilePicker) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'Windows installer', accept: { 'application/vnd.microsoft.portable-executable': ['.exe'] } }]
        });
      }

      status.textContent = 'Preparing the verified Windows installer…';
      const manifestResponse = await fetch(`${folder}/manifest.json`, { cache: 'no-store' });
      if (!manifestResponse.ok) throw new Error('Installer manifest is unavailable.');
      const manifest = await manifestResponse.json();
      if (manifest.version !== release || manifest.filename !== filename || !Array.isArray(manifest.parts) || !manifest.parts.length) {
        throw new Error('Installer manifest did not match this release.');
      }

      const writer = fileHandle ? await fileHandle.createWritable() : null;
      const chunks = [];
      let written = 0;
      try {
        for (let i = 0; i < manifest.parts.length; i++) {
          const part = manifest.parts[i];
          const response = await fetch(`${folder}/${part.file}`, { cache: 'no-store' });
          if (!response.ok) throw new Error(`Installer part ${i + 1} could not be downloaded.`);
          const data = await response.arrayBuffer();
          if (data.byteLength !== part.bytes) throw new Error(`Installer part ${i + 1} has the wrong size.`);
          const digest = await crypto.subtle.digest('SHA-256', data);
          const actualHash = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
          if (actualHash !== part.sha256) throw new Error(`Installer part ${i + 1} failed its integrity check.`);
          if (writer) await writer.write(data);
          else chunks.push(data);
          written += data.byteLength;
          status.textContent = `Downloading verified installer… ${Math.round(written / manifest.bytes * 100)}%`;
        }
        if (written !== manifest.bytes) throw new Error('The installer download is incomplete.');
        if (writer) await writer.close();
      } catch (error) {
        if (writer) await writer.abort().catch(() => {});
        throw error;
      }

      if (!fileHandle) {
        const blob = new Blob(chunks, { type: 'application/vnd.microsoft.portable-executable' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
      status.textContent = `SevenTask Calculator ${release} is ready.`;
    } catch (error) {
      if (error?.name === 'AbortError') {
        status.textContent = 'Download cancelled.';
      } else {
        console.error('SevenTask installer download failed:', error);
        status.textContent = `${error?.message || 'The installer could not be downloaded.'} Please retry.`;
      }
    } finally {
      buttons.forEach(item => {
        item.dataset.busy = 'false';
        item.removeAttribute('aria-busy');
      });
    }
  }));
})();
