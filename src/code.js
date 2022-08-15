import faker from 'faker/locale/fa'
faker.setLocale('fa')

figma.showUI(__html__, {
  height: 600
});

figma.ui.onmessage = function (msg) {
  if (msg.type === 'fakeit') {
    if (figma.currentPage.selection.length === 0) {
       figma.notify('Please select a text element !')
    }
    for (const node of figma.currentPage.selection) {
      var allpromise = []
      let len = node.characters.length
      for (let i = 0; i < len; i++) {
        allpromise.push(figma.loadFontAsync(node.getRangeFontName(i, i+1)))
      }
      Promise.all(allpromise).then(() => {
        let text = faker.name.findName()
        if (msg.faker === 'name') {
          text = faker.name.firstName().split('').reverse().join('')
        } else {
          let fakearray = msg.faker.split('/')
          text = faker[fakearray[0]][fakearray[1]](fakearray[2]).toString()
        }
        node.characters = text
      })
    }
  }
}
