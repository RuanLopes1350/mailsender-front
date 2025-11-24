import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generatePdf(emailData: any): Promise<void> {
    try {
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
        const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

        let page = pdfDoc.addPage()
        const { width, height } = page.getSize()

        let yPosition = height - 50
        const margin = 50
        const lineHeight = 20

        // Função para limpar e formatar texto
        const sanitizeText = (text: string): string => {
            return text
                // Remove tags HTML
                .replace(/<[^>]*>/g, '')
                // Remove entidades HTML
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&aacute;/g, 'á')
                .replace(/&eacute;/g, 'é')
                .replace(/&iacute;/g, 'í')
                .replace(/&oacute;/g, 'ó')
                .replace(/&uacute;/g, 'ú')
                .replace(/&atilde;/g, 'ã')
                .replace(/&otilde;/g, 'õ')
                .replace(/&ccedil;/g, 'ç')
                .replace(/&Aacute;/g, 'Á')
                .replace(/&Eacute;/g, 'É')
                .replace(/&Iacute;/g, 'Í')
                .replace(/&Oacute;/g, 'Ó')
                .replace(/&Uacute;/g, 'Ú')
                .replace(/&Atilde;/g, 'Ã')
                .replace(/&Otilde;/g, 'Õ')
                .replace(/&Ccedil;/g, 'Ç')
                // Remove variation selectors (usados em emojis)
                .replace(/[\uFE00-\uFE0F]/g, '')
                .replace(/[\u200D\u200B-\u200F]/g, '') // Zero-width joiners
                // Remove emojis e símbolos especiais (mantém letras acentuadas)
                .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emojis
                .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Símbolos diversos
                .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
                .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
                .replace(/[\u{1F000}-\u{1F02F}]/gu, '') // Mahjong Tiles
                .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '') // Playing Cards
                .replace(/[\u{E0000}-\u{E007F}]/gu, '') // Tags
                // Remove caracteres de controle
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                // Mantém apenas caracteres imprimíveis ASCII + acentuados latinos
                .split('')
                .filter(char => {
                    const code = char.charCodeAt(0)
                    // ASCII imprimível (32-126) OU acentuados latinos (192-255, exceto alguns)
                    return (code >= 32 && code <= 126) || (code >= 192 && code <= 255)
                })
                .join('')
                // Remove múltiplos espaços
                .replace(/\s+/g, ' ')
                .trim()
        }

        // Função para quebrar texto em múltiplas linhas
        const drawMultilineText = (text: string, startX: number, maxWidth: number, fontSize: number = 12, font: any = timesRomanFont) => {
            const words = text.split(' ')
            let currentLine = ''
            const lines: string[] = []

            words.forEach(word => {
                const testLine = currentLine ? `${currentLine} ${word}` : word
                const textWidth = font.widthOfTextAtSize(testLine, fontSize)

                if (textWidth > maxWidth && currentLine) {
                    lines.push(currentLine)
                    currentLine = word
                } else {
                    currentLine = testLine
                }
            })

            if (currentLine) {
                lines.push(currentLine)
            }

            lines.forEach((line, index) => {
                if (yPosition < 50) {
                    page = pdfDoc.addPage()
                    yPosition = page.getHeight() - 50
                }

                page.drawText(line, {
                    x: startX,
                    y: yPosition,
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0),
                })

                if (index < lines.length - 1) {
                    yPosition -= lineHeight * 0.8
                }
            })
        }

        // Título
        page.drawText('Detalhes do Email', {
            x: margin,
            y: yPosition,
            size: 18,
            font: timesRomanBold,
            color: rgb(0, 0, 0),
        })

        yPosition -= lineHeight * 2

        // Função auxiliar para adicionar linha com quebra automática
        const addLine = (label: string, value: string, indent: number = 0) => {
            if (yPosition < 50) {
                page = pdfDoc.addPage()
                yPosition = page.getHeight() - 50
            }

            const cleanLabel = sanitizeText(label)
            const cleanValue = sanitizeText(value || 'N/A')

            const labelX = margin + indent

            // Desenha o label
            page.drawText(`${cleanLabel}:`, {
                x: labelX,
                y: yPosition,
                size: 11,
                font: timesRomanBold,
                color: rgb(0.3, 0.3, 0.3),
            })

            yPosition -= lineHeight * 0.9

            // Desenha o valor com quebra de linha
            if (cleanValue.length > 60) {
                drawMultilineText(cleanValue, labelX + 10, width - margin - labelX - 10, 10, timesRomanFont)
            } else {
                page.drawText(cleanValue, {
                    x: labelX + 10,
                    y: yPosition,
                    size: 10,
                    font: timesRomanFont,
                    color: rgb(0, 0, 0),
                })
            }

            yPosition -= lineHeight * 0.7
        }

        // Adicionar dados do email
        if (typeof emailData === 'string') {
            try {
                emailData = JSON.parse(emailData)
            } catch (e) {
                // Se não for JSON, usar como texto simples
                const cleanText = sanitizeText(emailData)
                page.drawText(cleanText, {
                    x: margin,
                    y: yPosition,
                    size: 12,
                    font: timesRomanFont,
                    maxWidth: width - margin * 2,
                })

                const pdfBytes = await pdfDoc.save()
                downloadPdf(pdfBytes, 'email-detalhes.pdf')
                return
            }
        }

        // Adicionar separador
        const addSeparator = () => {
            yPosition -= lineHeight * 0.3
            if (yPosition < 50) {
                page = pdfDoc.addPage()
                yPosition = page.getHeight() - 50
            }
            page.drawText('_'.repeat(80), {
                x: margin,
                y: yPosition,
                size: 8,
                font: timesRomanFont,
                color: rgb(0.7, 0.7, 0.7),
            })
            yPosition -= lineHeight * 0.8
        }

        // Percorrer o objeto e adicionar cada campo
        Object.entries(emailData).forEach(([key, value]) => {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                // Se for objeto aninhado, adicionar título e itens
                if (yPosition < 100) {
                    page = pdfDoc.addPage()
                    yPosition = page.getHeight() - 50
                }

                const cleanKey = sanitizeText(key)

                // Adiciona título da seção
                page.drawText(cleanKey.toUpperCase(), {
                    x: margin,
                    y: yPosition,
                    size: 13,
                    font: timesRomanBold,
                    color: rgb(0.15, 0.15, 0.15),
                })
                yPosition -= lineHeight * 1.3

                Object.entries(value).forEach(([subKey, subValue]) => {
                    addLine(subKey, String(subValue), 15)
                })

                addSeparator()
            } else if (Array.isArray(value)) {
                // Se for array
                if (yPosition < 100) {
                    page = pdfDoc.addPage()
                    yPosition = page.getHeight() - 50
                }

                const cleanKey = sanitizeText(key)
                page.drawText(cleanKey.toUpperCase(), {
                    x: margin,
                    y: yPosition,
                    size: 13,
                    font: timesRomanBold,
                    color: rgb(0.15, 0.15, 0.15),
                })
                yPosition -= lineHeight * 1.2

                value.forEach((item, index) => {
                    if (yPosition < 50) {
                        page = pdfDoc.addPage()
                        yPosition = page.getHeight() - 50
                    }

                    const itemText = typeof item === 'object' ? JSON.stringify(item) : String(item)
                    const cleanItemText = sanitizeText(itemText)

                    page.drawText(`${index + 1}.`, {
                        x: margin + 15,
                        y: yPosition,
                        size: 10,
                        font: timesRomanBold,
                        color: rgb(0.3, 0.3, 0.3),
                    })

                    drawMultilineText(cleanItemText, margin + 30, width - margin * 2 - 30, 10, timesRomanFont)
                    yPosition -= lineHeight * 0.5
                })

                addSeparator()
            } else {
                // Campo simples
                addLine(key, String(value), 0)
            }
        })

        const pdfBytes = await pdfDoc.save()
        downloadPdf(pdfBytes, 'email-detalhes.pdf')
    } catch (error) {
        console.error('Erro ao gerar PDF:', error)
        alert('Erro ao gerar PDF. Verifique o console para mais detalhes.')
    }
}

function downloadPdf(pdfBytes: Uint8Array, fileName: string): void {
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}