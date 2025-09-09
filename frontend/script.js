// --------------------------------------
// Global state
// --------------------------------------
let token       = localStorage.getItem('token') || ''
let currentPage = 1
const pageSize  = 5
let allFiles    = []

// --------------------------------------
// API Calls: Auth, List, Upload, Transcode, Delete, Download
// --------------------------------------

// Fetch video list from server and render UI
async function listFiles() {
  console.log('listFiles() was called')
  console.log('Using token:', token)

  try {
    const res = await fetch('/api/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const errorData = await res.json()
      console.error('List failed:', errorData)
      alert(`List error: ${errorData.message || 'Unauthorized'}`)
      return
    }

    const data = await res.json()
    console.log('Raw response:', data)

  // Normalize response format
    allFiles = Array.isArray(data) ? data : data.videos || []
    console.log('Total files loaded:', allFiles.length)

    // Render UI
    currentPage = 1
    renderPage(currentPage)
    renderPaginationControls()

  } catch (err) {
    console.error('listFiles error:', err)
    alert('Failed to fetch file list. Check console for details.')
  }
}

// Authenticate user and store token
async function login() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  console.log('Login initiated')
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()

    if (!res.ok) {
      console.error('Login failed:', data)
      alert(`Login error: ${data.message || 'Invalid credentials'}`)
      return
    }
    // Store token for future requests
    token = data.accessToken
    localStorage.setItem('token', token)
    console.log('Token received:', token)

    // Refresh file list after login
    listFiles()

  } catch (err) {
    console.error('Login error:', err)
    alert('Login failed. Check console for details.')
  }
}

// Upload selected video file
function upload() {
  const fileInput = document.getElementById('videoFile')
  const file = fileInput.files[0]
  if (!file) {
    alert('Please choose a file')
    return
  }

  document.getElementById('uploadStatus').style.display = 'flex'
  const formData = new FormData()
  formData.append('video', file)

  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/api/upload', true)
  xhr.setRequestHeader('Authorization', `Bearer ${token}`)

  xhr.onload = () => {
    try {
      const res = JSON.parse(xhr.responseText)
      alert(res.message || 'Upload complete')
      listFiles()
    } catch (err) {
      console.error('Invalid response:', xhr.responseText)
      alert('Upload failed. Invalid server response.')
    } finally {
      document.getElementById('uploadStatus').style.display = 'none'
    }
  }

  xhr.onerror = () => {
    console.error('Network error during upload')
    alert('Upload failed due to network error.')
    document.getElementById('uploadStatus').style.display = 'none'
  }

  xhr.send(formData)
}

// Transcode selected video file
async function transcode(filename) {
  console.log('Transcode triggered:', filename)
  if (!filename) {
    alert('Please select a file to transcode.')
    return
  }

  document.getElementById('transcodeStatus').style.display = 'flex'
  try {
    const res = await fetch('/api/transcode', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename })
    })
    const data = await res.json()

    if (!res.ok) {
      console.error('Transcode failed:', data)
      alert(`Transcode error: ${data.message || 'Unknown error'}`)
    } else {
      alert(data.message || 'Transcoding complete')
      listFiles()
    }

  } catch (err) {
    console.error('Transcode error:', err)
    alert('Transcode failed. Check console for details.')
  } finally {
    document.getElementById('transcodeStatus').style.display = 'none'
  }
}

// Delete selected video file
async function deleteFile(filename) {
  console.log('Delete triggered:', filename)
  try {
    const res = await fetch('/api/delete', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename })
    })
    const data = await res.json()
    alert(data.message || 'File deleted')
    listFiles()
  } catch (err) {
    console.error('deleteFile error:', err)
    alert('Delete failed. Check console.')
  }
}

// Download selected video file
function downloadFile(filename) {
  console.log('Download triggered:', filename)
  fetch(`/api/download?filename=${encodeURIComponent(filename)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Download failed')
      return res.blob()
    })
    .then(blob => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    })
    .catch(err => {
      console.error('downloadFile error:', err)
      alert('Failed to download file.')
    })
}

// --------------------------------------
// UI Rendering: table, dropdown & pagination
// --------------------------------------

// Render the table & dropdown for the current page
function renderPage(page) {
  const select = document.getElementById('fileSelect')
  const table  = document.getElementById('fileTable')
  select.innerHTML = ''
  table.innerHTML  = '<tr><th>Preview</th><th>Actions</th></tr>'

  const start     = (page - 1) * pageSize
  const end       = start + pageSize
  const pageFiles = allFiles.slice(start, end)

  pageFiles.forEach(file => {
    // Add file to dropdown
    const option = document.createElement('option')
    option.value = file.filename
    option.textContent = file.filename
    select.appendChild(option)

    // Create table row with video preview and action buttons
    const row = document.createElement('tr')
      row.innerHTML = `
        <td>
          <video width="160" height="90" controls preload="metadata">
            <source src="/uploads/${file.filename}" 
                    type="video/${file.filename.endsWith('.mp4') ? 'mp4' : 'webm'}">
          </video>
          <div><strong>${file.filename}</strong></div>
          <div>Size: ${file.sizeMB || 'N/A'} MB</div>
          <div>Duration: ${file.duration || 'N/A'} sec</div>
        </td>
        <td>
          <button class="transcode" onclick="transcode('${file.filename}')">Transcode</button>
          <button class="delete" onclick="deleteFile('${file.filename}')">Delete</button>
          <button class="download" onclick="downloadFile('${file.filename}')">Download</button>
        </td>
      `
    table.appendChild(row)
  })
}

// Render pagination controls ( prevous, next buttons & page indicator )
function renderPaginationControls() {
  const container = document.getElementById('pagination');
  const totalPages = Math.ceil(allFiles.length / pageSize);
  container.innerHTML = '';
  if (totalPages <= 1) return;

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-btn prev'; // add styling class
  prevBtn.innerHTML = 'Previous'; // add rune symbol
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderPage(currentPage);
    renderPaginationControls();
  };

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn next'; // add styling class
  nextBtn.innerHTML = 'Next'; // add rune symbol
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderPage(currentPage);
    renderPaginationControls();
  };

  // Page indicator
  const pageIndicator = document.createElement('span');
  pageIndicator.className = 'page-indicator';
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  
  // Assemble pagination controls
  container.appendChild(prevBtn);
  container.appendChild(pageIndicator);
  container.appendChild(nextBtn);
}

// --------------------------------------
// Page initialization
// --------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  if (token) {
    console.log('Token exists, calling listFiles()')
    listFiles()
  } else {
    console.log('No token found in localStorage')
  }
})