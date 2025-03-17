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

// EXAMPLE: Opening the side panel on a specific website

// const GOOGLE_ORIGIN = 'https://www.google.com'

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (!tab.url) return
//   const url = new URL(tab.url)
//   // Enables the side panel on google.com
//   if (url.origin === GOOGLE_ORIGIN) {
//     await chrome.sidePanel.setOptions({
//       tabId,
//       path: 'sidepanel.html',
//       enabled: true,
//     })
//   } else {
//     // Disables the side panel on all other sites
//     await chrome.sidePanel.setOptions({
//       tabId,
//       enabled: false,
//     })
//   }
// })
