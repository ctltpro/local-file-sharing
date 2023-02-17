var pond = FilePond.create(document.getElementById('fileUploadInput'), {
    server: '/upload',
    onprocessfile: function (err, file) {
        if (!err) {
            setTimeout(function () {
                pond.removeFile(file)
                socket.emit('uploaded')
                getFiles()
            }, 1000)
        }
    }
});
var currentFiles = document.getElementById('currentFiles')

function populateFileBlocks(arrObj) {
    var html = ''
    var arr = Object.keys(arrObj)
    for (var a of arr) {
        html += `<div class="p-3 bg-light shadow-sm rounded-3 d-flex justify-content-between align-items-center m-2">
        <div>
            ${arrObj[a] === "Directory" ? '<i class="fa-solid fa-folder me-2"></i>' : '<i class="fa-regular fa-file me-2"></i>'}
            ${a} <a target="_blank" href="/download?file=${a}&type=${arrObj[a]}"><i class="ms-2 fa-solid fa-download"></i></a>
        </div>
        <div>
            <a href="javascript:deleteFiles('${a}')"><i class="text-danger fa-solid fa-trash-can"></i></a>
        </div>
    </div>`
    }
    currentFiles.innerHTML = html
}
function deleteFiles(a) {
    var x = confirm('Are you Sure?')
    if (x) window.location.replace(`/delete-file?file=${a}`)
}

function getFiles() {
    fetch('/get-files')
        .then((response) => {
            return response.json()
        })
        .then((rjson) => {
            populateFileBlocks(rjson)
        })
        .catch((err) => {
            console.error(err)
        });
}

var socket = io();
socket.on('connect', () => {
    socket.emit('uploaded')
    getFiles()
})

socket.on('do-sync',()=>{
    getFiles()
})
