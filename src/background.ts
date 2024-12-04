// When the extension is installed, set the side panel to open on action click
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled')
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))
})

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension',
  )
  console.log('request', request)

  !!sendResponse && sendResponse({})

  return true
})

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  console.log('tabId', tabId)
  console.log('info', info)
  console.log('tab', tab)
})
