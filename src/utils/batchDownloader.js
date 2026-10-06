import { ElMessage } from 'element-plus'

/**
 * Downloads multiple files sequentially to prevent browser popup blockers.
 * @param {Array<{ name: string, url: string }>} files 
 * @param {Function} [onProgress] callback (current, total)
 */
export async function downloadMultipleFiles(files, onProgress) {
  if (!files || files.length === 0) {
    ElMessage.warning('請先勾選欲下載的檔案')
    return false
  }

  const total = files.length
  ElMessage.info(`開始下載 ${total} 個檔案，請留意瀏覽器下載提示...`)

  for (let i = 0; i < total; i++) {
    const file = files[i]
    if (onProgress) onProgress(i + 1, total)

    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name || ''
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Wait 350ms between each download trigger
    if (i < total - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350))
    }
  }

  ElMessage.success(`已完成 ${total} 個檔案的下載觸發！`)
  return true
}
