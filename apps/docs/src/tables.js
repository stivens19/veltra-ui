// VeltraUI Interactive DataTables Controller: Search, Sort, Pagination, Exports & Bulk Selection

export function initDataTables() {
  const table = document.getElementById('vlt-interactive-datatable');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const filterInput = document.getElementById('dt-search-input');
  const entriesSelect = document.getElementById('dt-entries-select');
  const paginationContainer = document.getElementById('dt-pagination');
  const infoLabel = document.getElementById('dt-info-label');
  const selectAllCheckbox = document.getElementById('dt-select-all');
  const bulkActionBar = document.getElementById('dt-bulk-action-bar');
  const bulkSelectedCount = document.getElementById('dt-bulk-count');

  let currentPage = 1;
  let pageSize = parseInt(entriesSelect?.value) || 5;
  let filteredRows = [...rows];
  let currentSort = { colIndex: -1, asc: true };

  // 1. Filter Logic
  function applyFilter() {
    const query = filterInput ? filterInput.value.toLowerCase().trim() : '';
    filteredRows = rows.filter(row => {
      const text = row.textContent.toLowerCase();
      return text.includes(query);
    });
    currentPage = 1;
    render();
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
  }

  // 2. Page Size Logic
  if (entriesSelect) {
    entriesSelect.addEventListener('change', (e) => {
      pageSize = parseInt(e.target.value) || 5;
      currentPage = 1;
      render();
    });
  }

  // 3. Render Table & Pagination
  function render() {
    const total = filteredRows.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, total);

    // Hide all original rows
    rows.forEach(r => r.style.display = 'none');

    // Show current page filtered rows
    for (let i = start; i < end; i++) {
      if (filteredRows[i]) {
        filteredRows[i].style.display = '';
      }
    }

    // Update info text
    if (infoLabel) {
      if (total === 0) {
        infoLabel.textContent = 'Mostrando 0 registros';
      } else {
        infoLabel.textContent = `Mostrando ${start + 1} a ${end} de ${total} registros`;
      }
    }

    // Render pagination buttons
    if (paginationContainer) {
      paginationContainer.innerHTML = '';

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
      prevBtn.innerHTML = '&larr;';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          render();
        }
      });
      paginationContainer.appendChild(prevBtn);

      // Number Buttons
      for (let p = 1; p <= totalPages; p++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = `page-btn ${p === currentPage ? 'active' : ''}`;
        pageBtn.textContent = p;
        pageBtn.addEventListener('click', () => {
          currentPage = p;
          render();
        });
        paginationContainer.appendChild(pageBtn);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
      nextBtn.innerHTML = '&rarr;';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          render();
        }
      });
      paginationContainer.appendChild(nextBtn);
    }

    updateSelectionCount();
  }

  // 4. Sorting Logic
  const sortHeaders = table.querySelectorAll('th.vlt-th-sortable');
  sortHeaders.forEach((th, idx) => {
    th.addEventListener('click', () => {
      // Find actual col index ignoring checkbox if any
      const colIndex = Array.from(th.parentNode.children).indexOf(th);
      const asc = (currentSort.colIndex === colIndex) ? !currentSort.asc : true;
      currentSort = { colIndex, asc };

      sortHeaders.forEach(h => {
        h.classList.remove('asc', 'desc');
      });
      th.classList.add(asc ? 'asc' : 'desc');

      filteredRows.sort((rowA, rowB) => {
        const valA = rowA.children[colIndex]?.textContent.trim().toLowerCase() || '';
        const valB = rowB.children[colIndex]?.textContent.trim().toLowerCase() || '';
        
        const numA = parseFloat(valA.replace(/[^0-9.-]+/g, ''));
        const numB = parseFloat(valB.replace(/[^0-9.-]+/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
          return asc ? numA - numB : numB - numA;
        }
        return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });

      render();
    });
  });

  // 5. Checkbox Selection & Bulk Actions
  function updateSelectionCount() {
    const selectedBoxes = tbody.querySelectorAll('.row-select-checkbox:checked');
    const count = selectedBoxes.length;

    if (bulkSelectedCount) bulkSelectedCount.textContent = count;
    if (bulkActionBar) {
      bulkActionBar.style.display = count > 0 ? 'flex' : 'none';
    }

    // Highlight selected rows
    tbody.querySelectorAll('tr').forEach(tr => {
      const chk = tr.querySelector('.row-select-checkbox');
      tr.classList.toggle('is-selected', !!chk?.checked);
    });

    if (selectAllCheckbox) {
      const allRowBoxes = tbody.querySelectorAll('.row-select-checkbox');
      selectAllCheckbox.checked = allRowBoxes.length > 0 && count === allRowBoxes.length;
    }
  }

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const checked = e.target.checked;
      tbody.querySelectorAll('.row-select-checkbox').forEach(chk => {
        chk.checked = checked;
      });
      updateSelectionCount();
    });
  }

  tbody.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-select-checkbox')) {
      updateSelectionCount();
    }
  });

  // 6. Export Actions (Copy, CSV, Excel, Print)
  const btnExportCopy = document.getElementById('dt-export-copy');
  const btnExportCsv = document.getElementById('dt-export-csv');
  const btnExportExcel = document.getElementById('dt-export-excel');
  const btnExportPrint = document.getElementById('dt-export-print');

  function getTableDataAsArray() {
    const headers = Array.from(table.querySelectorAll('thead th'))
      .map(th => th.textContent.replace(/[\n\r]+/g, ' ').trim())
      .filter((text, idx) => idx > 0 && !text.includes('Acciones')); // Skip checkbox & action col

    const data = filteredRows.map(row => {
      return Array.from(row.querySelectorAll('td'))
        .filter((_, idx) => idx > 0 && idx < row.children.length - 1)
        .map(td => td.textContent.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim());
    });

    return { headers, data };
  }

  if (btnExportCopy) {
    btnExportCopy.addEventListener('click', () => {
      const { headers, data } = getTableDataAsArray();
      let text = headers.join('\t') + '\n';
      data.forEach(r => text += r.join('\t') + '\n');
      navigator.clipboard.writeText(text).then(() => {
        if (window.veltra?.modal?.toast) {
          window.veltra.modal.toast({
            title: '¡Copiado!',
            message: `${data.length} registros copiados al portapapeles.`,
            type: 'cyan',
            duration: 3000
          });
        }
      });
    });
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const { headers, data } = getTableDataAsArray();
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      data.forEach(r => {
        csv += r.map(c => `"${c.replace(/"/g, '""')}"`).join(',') + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VeltraUI_DataTables_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      const { headers, data } = getTableDataAsArray();
      let html = '<table border="1"><thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
      data.forEach(r => {
        html += '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>';
      });
      html += '</tbody></table>';

      const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VeltraUI_Export_${new Date().toISOString().slice(0, 10)}.xls`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (btnExportPrint) {
    btnExportPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Initial render
  render();
}

// 7. jsGrid & Editable CRUD Table Controller
export function initJsGrid() {
  const jsgridTable = document.getElementById('vlt-jsgrid-table');
  if (!jsgridTable) return;

  const tbody = jsgridTable.querySelector('tbody');
  const addBtn = document.getElementById('jsgrid-btn-add');
  const addName = document.getElementById('jsgrid-add-name');
  const addAge = document.getElementById('jsgrid-add-age');
  const addAddress = document.getElementById('jsgrid-add-address');
  const addCountry = document.getElementById('jsgrid-add-country');
  const addMarried = document.getElementById('jsgrid-add-married');

  // Insert Row
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = addName?.value.trim();
      const age = addAge?.value.trim() || '25';
      const address = addAddress?.value.trim() || 'Av. Principal 123';
      const country = addCountry?.value || 'Perú';
      const married = addMarried?.checked ? 'Sí' : 'No';

      if (!name) {
        if (window.veltra?.modal?.toast) {
          window.veltra.modal.toast({
            title: 'Campo Requerido',
            message: 'Por favor ingresa un nombre para el nuevo registro.',
            type: 'rose',
            duration: 3000
          });
        } else {
          alert('Por favor ingresa un nombre.');
        }
        addName?.focus();
        return;
      }

      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 hover:bg-slate-50/80 transition-colors animate-in fade-in duration-200';
      tr.innerHTML = `
        <td class="cell-name font-bold text-xs text-slate-900">${name}</td>
        <td class="cell-age font-mono text-slate-700">${age}</td>
        <td class="cell-address text-slate-600">${address}</td>
        <td class="cell-country"><span class="vlt-tag-code">${country}</span></td>
        <td class="cell-married text-center"><span class="vlt-pill ${married === 'Sí' ? 'vlt-pill-emerald' : 'vlt-pill-slate'} py-0.5 px-2 text-xs">${married}</span></td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5 action-buttons">
            <button type="button" class="btn-edit p-1.5 rounded-lg hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 transition-colors cursor-pointer" title="Editar"><i data-lucide="edit" class="w-4 h-4"></i></button>
            <button type="button" class="btn-delete p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer" title="Eliminar"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);

      // Recreate icons inside newly created row
      if (window.lucide) {
        window.lucide.createIcons();
      }

      // Clear add inputs
      if (addName) addName.value = '';
      if (addAge) addAge.value = '';
      if (addAddress) addAddress.value = '';
      if (addMarried) addMarried.checked = false;

      if (window.veltra?.modal?.toast) {
        window.veltra.modal.toast({
          title: '¡Fila Creada!',
          message: `Registro para "${name}" agregado con éxito.`,
          type: 'emerald',
          duration: 3000
        });
      }
    });
  }

  // Row Edit / Delete delegation
  tbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    const deleteBtn = e.target.closest('.btn-delete');
    const saveBtn = e.target.closest('.btn-save');
    const cancelBtn = e.target.closest('.btn-cancel');

    const tr = e.target.closest('tr');
    if (!tr) return;

    // Delete Action
    if (deleteBtn) {
      const name = tr.querySelector('.cell-name')?.textContent || 'registro';
      tr.style.opacity = '0';
      tr.style.transition = 'opacity 0.2s ease';
      setTimeout(() => {
        tr.remove();
        if (window.veltra?.modal?.toast) {
          window.veltra.modal.toast({
            title: 'Registro Eliminado',
            message: `El registro de "${name}" fue eliminado.`,
            type: 'rose',
            duration: 3000
          });
        }
      }, 200);
      return;
    }

    // Edit Mode Action
    if (editBtn) {
      if (tr.classList.contains('is-editing')) return;
      tr.classList.add('is-editing', 'bg-cyan-50/40');

      const cellName = tr.querySelector('.cell-name');
      const cellAge = tr.querySelector('.cell-age');
      const cellAddress = tr.querySelector('.cell-address');
      const cellCountry = tr.querySelector('.cell-country');
      const cellMarried = tr.querySelector('.cell-married');
      const actionBox = tr.querySelector('.action-buttons');

      tr._origValues = {
        name: cellName.textContent.trim(),
        age: cellAge.textContent.trim(),
        address: cellAddress.textContent.trim(),
        country: cellCountry.textContent.trim(),
        married: cellMarried.textContent.trim()
      };

      cellName.innerHTML = `<input type="text" class="w-full px-2 py-1 text-xs rounded border border-cyan-400 bg-white" value="${tr._origValues.name}" />`;
      cellAge.innerHTML = `<input type="number" class="w-16 px-2 py-1 text-xs rounded border border-cyan-400 bg-white" value="${tr._origValues.age}" />`;
      cellAddress.innerHTML = `<input type="text" class="w-full px-2 py-1 text-xs rounded border border-cyan-400 bg-white" value="${tr._origValues.address}" />`;
      cellCountry.innerHTML = `
        <select class="px-2 py-1 text-xs rounded border border-cyan-400 bg-white">
          <option ${tr._origValues.country === 'Perú' ? 'selected' : ''}>Perú</option>
          <option ${tr._origValues.country === 'México' ? 'selected' : ''}>México</option>
          <option ${tr._origValues.country === 'España' ? 'selected' : ''}>España</option>
          <option ${tr._origValues.country === 'Colombia' ? 'selected' : ''}>Colombia</option>
          <option ${tr._origValues.country === 'Estados Unidos' ? 'selected' : ''}>Estados Unidos</option>
        </select>
      `;
      cellMarried.innerHTML = `<input type="checkbox" class="vlt-checkbox" ${tr._origValues.married === 'Sí' ? 'checked' : ''} />`;

      actionBox.innerHTML = `
        <button type="button" class="btn-save p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer" title="Guardar"><i data-lucide="check" class="w-4 h-4"></i></button>
        <button type="button" class="btn-cancel p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer" title="Cancelar"><i data-lucide="x" class="w-4 h-4"></i></button>
      `;

      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Save Action
    if (saveBtn) {
      const cellName = tr.querySelector('.cell-name');
      const cellAge = tr.querySelector('.cell-age');
      const cellAddress = tr.querySelector('.cell-address');
      const cellCountry = tr.querySelector('.cell-country');
      const cellMarried = tr.querySelector('.cell-married');
      const actionBox = tr.querySelector('.action-buttons');

      const newName = cellName.querySelector('input').value.trim() || tr._origValues.name;
      const newAge = cellAge.querySelector('input').value.trim() || tr._origValues.age;
      const newAddress = cellAddress.querySelector('input').value.trim() || tr._origValues.address;
      const newCountry = cellCountry.querySelector('select').value;
      const newMarried = cellMarried.querySelector('input').checked ? 'Sí' : 'No';

      cellName.innerHTML = newName;
      cellAge.innerHTML = newAge;
      cellAddress.innerHTML = newAddress;
      cellCountry.innerHTML = `<span class="vlt-tag-code">${newCountry}</span>`;
      cellMarried.innerHTML = `<span class="vlt-pill ${newMarried === 'Sí' ? 'vlt-pill-emerald' : 'vlt-pill-slate'} py-0.5 px-2 text-xs">${newMarried}</span>`;

      tr.classList.remove('is-editing', 'bg-cyan-50/40');

      actionBox.innerHTML = `
        <button type="button" class="btn-edit p-1.5 rounded-lg hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 transition-colors cursor-pointer" title="Editar"><i data-lucide="edit" class="w-4 h-4"></i></button>
        <button type="button" class="btn-delete p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer" title="Eliminar"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
      `;

      if (window.lucide) window.lucide.createIcons();

      if (window.veltra?.modal?.toast) {
        window.veltra.modal.toast({
          title: 'Guardado',
          message: `Datos de "${newName}" actualizados en línea.`,
          type: 'emerald',
          duration: 3000
        });
      }
      return;
    }

    // Cancel Action
    if (cancelBtn) {
      const cellName = tr.querySelector('.cell-name');
      const cellAge = tr.querySelector('.cell-age');
      const cellAddress = tr.querySelector('.cell-address');
      const cellCountry = tr.querySelector('.cell-country');
      const cellMarried = tr.querySelector('.cell-married');
      const actionBox = tr.querySelector('.action-buttons');

      cellName.innerHTML = tr._origValues.name;
      cellAge.innerHTML = tr._origValues.age;
      cellAddress.innerHTML = tr._origValues.address;
      cellCountry.innerHTML = `<span class="vlt-tag-code">${tr._origValues.country}</span>`;
      cellMarried.innerHTML = `<span class="vlt-pill ${tr._origValues.married === 'Sí' ? 'vlt-pill-emerald' : 'vlt-pill-slate'} py-0.5 px-2 text-xs">${tr._origValues.married}</span>`;

      tr.classList.remove('is-editing', 'bg-cyan-50/40');

      actionBox.innerHTML = `
        <button type="button" class="btn-edit p-1.5 rounded-lg hover:bg-cyan-50 text-slate-500 hover:text-cyan-600 transition-colors cursor-pointer" title="Editar"><i data-lucide="edit" class="w-4 h-4"></i></button>
        <button type="button" class="btn-delete p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer" title="Eliminar"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
      `;

      if (window.lucide) window.lucide.createIcons();
    }
  });

  // 8. Expandable Rows (Master-Detail Accordion)
  const masterTable = document.getElementById('vlt-expandable-table');
  if (masterTable) {
    masterTable.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.btn-toggle-expand');
      if (!toggleBtn) return;

      const parentTr = toggleBtn.closest('tr');
      const detailRow = parentTr.nextElementSibling;

      if (detailRow && detailRow.classList.contains('expandable-detail-row')) {
        const isHidden = detailRow.classList.contains('hidden');
        detailRow.classList.toggle('hidden', !isHidden);
        toggleBtn.classList.toggle('rotate-90', isHidden);
      }
    });
  }
}


