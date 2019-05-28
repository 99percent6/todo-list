export const priorityList = () => {
  return [
    {
      value: 'Важно Срочно',
      code: 1,
      color: 'red',
    },
    {
      value: 'Важно Не Срочно',
      code: 2,
      color: 'green',
    },
    {
      value: 'Не Важно Срочно',
      code: 3,
      color: 'orange',
    },
    {
      value: 'Не Важно Не Срочно',
      code: 4,
      color: 'gray',
    },
  ];
};

export const slugify = (text) => {
  let s = text ? text.toLowerCase() : ''
  let opt = {
    'delimiter': '-',
    'limit': undefined,
    'replacements': {},
    'transliterate': true
  }

  var charMap = {
    '©': '(c)',
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'yo',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'j',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'c',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sh',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya'
  }

  if (opt.transliterate) {
    for (var k in charMap) {
      s = s.replace(RegExp(k, 'g'), charMap[k])
    }
  }

  // Replace non-alphanumeric characters with our delimiter
  var alnum = RegExp('[^a-z0-9]+', 'ig')
  s = s.replace(alnum, opt.delimiter)

  // Remove duplicate delimiters
  s = s.replace(RegExp('[' + opt.delimiter + ']{2,}', 'g'), opt.delimiter)

  // Truncate slug to max. characters
  s = s.substring(0, opt.limit)

  // Remove delimiter from ends
  s = s.replace(RegExp('(^' + opt.delimiter + '|' + opt.delimiter + '$)', 'g'), '')
  return s
}
