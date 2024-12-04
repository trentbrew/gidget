/**
 * Advanced markdown-like text formatter with improved parsing and support
 */

export class TextFormatter {
  /**
   * Main formatting method with expanded options
   * @param {string} text - The input text to format
   * @param {string} format - The formatting type (text, markdown, code)
   * @param {Object} options - Additional formatting options
   * @returns {string} Formatted text
   */
  static format(text, format = 'text', options = {}) {
    switch (format) {
      case 'markdown':
        return TextFormatter.formatMarkdown(text, options)
      case 'code':
        return TextFormatter.formatCode(text, options)
      default:
        return TextFormatter.escapeHtml(text)
    }
  }

  /**
   * Advanced markdown formatting with more comprehensive support
   * @param {string} text - The markdown text to format
   * @param {Object} options - Formatting configuration
   * @returns {string} HTML-formatted text
   */
  static formatMarkdown(text, options = {}) {
    const {
      headerIds = true,
      allowHtml = false,
      supportedFormats = [
        'headers',
        'bold',
        'italic',
        'strikethrough',
        'code',
        'fencedCode',
        'blockquote',
        'lists',
        'images',
        'links',
        'horizontalRule',
        'tables',
      ],
    } = options

    let formatted = TextFormatter.escapeHtml(text, allowHtml)

    // Fenced code blocks
    if (supportedFormats.includes('fencedCode')) {
      formatted = formatted.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (match, lang, code) => {
          const languageClass = lang ? ` class="language-${lang}"` : ''
          return `<pre><code${languageClass}>${TextFormatter.escapeHtml(
            code,
            allowHtml,
          )}</code></pre>`
        },
      )
    }

    // Blockquotes
    if (supportedFormats.includes('blockquote')) {
      formatted = formatted.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    }

    // Headers
    if (supportedFormats.includes('headers')) {
      formatted = formatted.replace(
        /^(#{1,6}) (.+)$/gm,
        (match, hashes, content) => {
          const level = hashes.length
          const id = headerIds ? ` id="${TextFormatter.slugify(content)}"` : ''
          return `<h${level}${id}>${content.trim()}</h${level}>`
        },
      )
    }

    // Horizontal rules
    if (supportedFormats.includes('horizontalRule')) {
      formatted = formatted.replace(/^(\*\*\*|---|___)\s*$/gm, '<hr>')
    }

    // Bold (support for **bold** and __bold__)
    if (supportedFormats.includes('bold')) {
      formatted = formatted.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
    }

    // Italic (support for *italic* and _italic_)
    if (supportedFormats.includes('italic')) {
      formatted = formatted.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
    }

    // Strikethrough (~~strikethrough~~)
    if (supportedFormats.includes('strikethrough')) {
      formatted = formatted.replace(/~~(.*?)~~/g, '<del>$1</del>')
    }

    // Inline code
    if (supportedFormats.includes('code')) {
      formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>')
    }

    // Images
    if (supportedFormats.includes('images')) {
      formatted = formatted.replace(
        /!\[([^\]]*)\]\(([^\)]+)\)/g,
        '<img src="$2" alt="$1">',
      )
    }

    // Links
    if (supportedFormats.includes('links')) {
      formatted = formatted.replace(
        /\[([^\]]+)\]\(([^\)]+)\)/g,
        '<a href="$2">$1</a>',
      )
    }

    // Tables
    if (supportedFormats.includes('tables')) {
      const tableRegex = /^((\|.*\|)\n)+/gm
      formatted = formatted.replace(tableRegex, (match) => {
        const rows = match.trim().split('\n')
        let thead = ''
        let tbody = ''
        rows.forEach((row, index) => {
          const cells = row
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim())
          const tag = index === 0 ? 'th' : 'td'
          const rowHtml = cells
            .map((cell) => `<${tag}>${cell}</${tag}>`)
            .join('')
          if (index === 0) {
            thead = `<tr>${rowHtml}</tr>`
          } else {
            tbody += `<tr>${rowHtml}</tr>`
          }
        })
        return `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`
      })
    }

    // Lists with nested support
    if (supportedFormats.includes('lists')) {
      const parseList = (lines, index = 0, indentLevel = 0) => {
        let result = ''
        let listTag = ''
        while (index < lines.length) {
          const line = lines[index]
          const match = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/)
          if (match) {
            const [_, spaces, marker, content] = match
            const currentIndent = spaces.length
            const isOrdered = /^\d+\.$/.test(marker)
            const newListTag = isOrdered ? 'ol' : 'ul'

            if (currentIndent > indentLevel) {
              const nested = parseList(lines, index, currentIndent)
              result += nested.result
              index = nested.index
              continue
            } else if (currentIndent < indentLevel) {
              break
            }

            if (listTag !== newListTag) {
              if (listTag) result += `</${listTag}>`
              result += `<${newListTag}>`
              listTag = newListTag
            }
            result += `<li>${content.trim()}`
            index++

            // Check for nested lists
            if (index < lines.length) {
              const nextLineIndentMatch = lines[index].match(/^(\s*)/)
              const nextLineIndent = nextLineIndentMatch
                ? nextLineIndentMatch[1].length
                : 0
              if (nextLineIndent > currentIndent) {
                const nested = parseList(lines, index, nextLineIndent)
                result += nested.result
                index = nested.index
              }
            }
            result += `</li>`
          } else {
            break
          }
        }
        if (listTag) result += `</${listTag}>`
        return { result, index }
      }

      const lines = formatted.split('\n')
      const parsed = parseList(lines)
      formatted = parsed.result + lines.slice(parsed.index).join('\n')
    }

    // Paragraphs
    const paragraphs = formatted.trim().split(/\n{2,}/)
    formatted = paragraphs.map((para) => `<p>${para.trim()}</p>`).join('')

    return formatted
  }

  /**
   * Code formatting with optional language syntax highlighting
   * @param {string} text - The code text to format
   * @param {Object} options - Formatting configuration
   * @returns {string} Formatted code block
   */
  static formatCode(text, options = {}) {
    const { language = '' } = options
    const escaped = TextFormatter.escapeHtml(text)
    return `<pre><code class="language-${language}">${escaped}</code></pre>`
  }

  /**
   * Robust HTML escaping method
   * @param {string} text - Text to escape
   * @param {boolean} allowHtml - Whether to allow inline HTML
   * @returns {string} HTML-safe text
   */
  static escapeHtml(text, allowHtml = false) {
    if (allowHtml) return text
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Generate a URL-friendly slug from text
   * @param {string} text - Text to convert to slug
   * @returns {string} Slugified text
   */
  static slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}
