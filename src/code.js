import faker from 'faker/locale/fa'
faker.setLocale('fa')
figma.showUI(__html__, {
  height: 600
});
const parabicNumbers = /[\u06f0-\u06f9]|[\u0660-\u0669]/g;
const parabic = /[\u0600-\u08bd\s]|[\ufe70-\ufefc]/g;
const superSubs = /[\u064b-\u065f]|[\u06D4-\u06DC]|[\u06DF-\u06E8]|[\u06EA-\u06ED]/g;
Array.prototype['swapItems'] = function (a, b) {
  this[a] = this.splice(b, 1, this[a])[0];
  return this;
}
const revert = text => {
  return text.split(' ').reduce((res, word) => {
    const lastItem = res[res.length - 1];
    const revertedCurrent = word.split('').reverse();
    if (word.trim().match(parabic) && !word.trim().match(parabicNumbers)) {
      if (word.match(superSubs)) {
        word.match(superSubs).forEach(sym => {
          revertedCurrent.swapItems(revertedCurrent.indexOf(sym), revertedCurrent.indexOf(sym) + 1);
        });
        return res.concat(revertedCurrent.join(''))
      }
      return res.concat(revertedCurrent.join(''));
    } else {
      if (!lastItem) {
        return res.concat(word);
      } else {
        if (!lastItem.replace(/ /g, '').match(parabic) || lastItem.match(parabicNumbers)) {
          return res.slice(0, res.length - 1).concat(lastItem).concat(word);
        } else {
          return res.concat(word);
        }
      }
    }
  }, []).reverse().join(' ');
}
const revertParagraph = p => {
  return p.split('\n').map(revert).join('\n');
}
const flipText = text => {
  console.log('flip text')
  return revertParagraph(text)
}
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
          if (msg.norevert) {
            text = text  
          } else {
            text = flipText(text)
          }
        }
        node.characters = text
      })
    }
  }
};
