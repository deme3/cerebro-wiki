import icon from './icon.png'
import Preview from "./Preview"
import getSuggestions from "./getWikiSugg"
import getPage from "./getWikiPreview"
const order = 12
const previewCharBlacklist = ['\uf8ff', '\uFFFD']

const plugin = ({ term, actions, display }) => {
  var search = (searchTerm) => {
    const q = encodeURIComponent(searchTerm)
    // https://en.wikipedia.org/w/api.php?action=opensearch&format=json&formatversion=2&search=javascreipt&namespace=0&limit=10&suggest=true
    // https://www.wikipedia.org/search-redirect.php?family=wikipedia&language=en&search=rice&language=en&go=Go
    // console.log(':::::::::::::::::::', actions);
    actions.open(' https://www.wikipedia.org/search-redirect.php?family=wikipedia&language=en&search=' + q + '&language=en&go=Go')
    actions.hideWindow()
  }

  var wikiSuggestions = getSuggestions(term)
  wikiSuggestions.then(data => {
    var dynOrder = order;
    var pagesString = data[1].map(title => encodeURIComponent(title)).join("|");
    var pages = getPage(pagesString)
    pages.then(pagesData => {
      var rawData = pagesData.query.pages
      var keys = Object.keys(rawData)
      var extracts = [];
      for(var i = 0; i<keys.length; i++) {
          var extractObject = rawData[keys[i]]
          var idx = extractObject.title
          extracts[idx] = extractObject.extract
          previewCharBlacklist.map(char => {extracts[idx] = extracts[idx].replace(char, '')})
      }

      data[1].map(entry => {
        display({
          icon: icon,
          title: entry,
          order: dynOrder++,
          onSelect: () => search(entry),
          getPreview: () => <Preview term={entry} previewText={extracts[entry]} />
        })
      })
    })
  })
}

module.exports = {
  fn: plugin
}
