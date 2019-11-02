# Credit: https://stackoverflow.com/a/35274078
dropzoneId = "table";

window.addEventListener("dragenter", (e)->
  if (e.target.id != dropzoneId)
    e.preventDefault()
    e.dataTransfer.effectAllowed = "none"
    e.dataTransfer.dropEffect = "none"
  false)

window.addEventListener("dragover", (e)->
  if (e.target.id != dropzoneId)
    e.preventDefault()
    e.dataTransfer.effectAllowed = "none"
    e.dataTransfer.dropEffect = "none"
)

window.addEventListener("drop", (e)->
  if (e.target.id != dropzoneId)
    e.preventDefault()
    e.dataTransfer.effectAllowed = "none"
    e.dataTransfer.dropEffect = "none"
)