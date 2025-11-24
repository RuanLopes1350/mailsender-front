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

        // Função para limpar caracteres especiais
        const sanitizeText = (text: string): string => {
            return text
                .replace(/[^\x00-\x7F]/g, '') // Remove caracteres não-ASCII
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove caracteres de controle
                .trim()
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

        // Função auxiliar para adicionar linha
        const addLine = (label: string, value: string, isBold: boolean = false) => {
            if (yPosition < 50) {
                // Adiciona nova página se necessário
                page = pdfDoc.addPage()
                yPosition = page.getHeight() - 50
            }

            const cleanLabel = sanitizeText(label)
            const cleanValue = sanitizeText(value || 'N/A')

            page.drawText(`${cleanLabel}:`, {
                x: margin,
                y: yPosition,
                size: 12,
                font: timesRomanBold,
                color: rgb(0.2, 0.2, 0.2),
            })

            page.drawText(cleanValue, {
                x: margin + 120,
                y: yPosition,
                size: 12,
                font: isBold ? timesRomanBold : timesRomanFont,
                color: rgb(0, 0, 0),
                maxWidth: width - margin - 140,
            })

            yPosition -= lineHeight
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

        // Percorrer o objeto e adicionar cada campo
        Object.entries(emailData).forEach(([key, value]) => {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                // Se for objeto aninhado, adicionar título e itens
                yPosition -= lineHeight / 2

                if (yPosition < 50) {
                    page = pdfDoc.addPage()
                    yPosition = page.getHeight() - 50
                }

                const cleanKey = sanitizeText(key)
                page.drawText(`${cleanKey}:`, {
                    x: margin,
                    y: yPosition,
                    size: 14,
                    font: timesRomanBold,
                    color: rgb(0.1, 0.1, 0.1),
                })
                yPosition -= lineHeight

                Object.entries(value).forEach(([subKey, subValue]) => {
                    addLine(`  ${subKey}`, String(subValue))
                })
            } else if (Array.isArray(value)) {
                // Se for array
                if (yPosition < 50) {
                    page = pdfDoc.addPage()
                    yPosition = page.getHeight() - 50
                }

                const cleanKey = sanitizeText(key)
                page.drawText(`${cleanKey}:`, {
                    x: margin,
                    y: yPosition,
                    size: 12,
                    font: timesRomanBold,
                })
                yPosition -= lineHeight

                value.forEach((item, index) => {
                    if (yPosition < 50) {
                        page = pdfDoc.addPage()
                        yPosition = page.getHeight() - 50
                    }

                    const itemText = typeof item === 'object' ? JSON.stringify(item) : String(item)
                    const cleanItemText = sanitizeText(itemText)
                    page.drawText(`  ${index + 1}. ${cleanItemText}`, {
                        x: margin + 20,
                        y: yPosition,
                        size: 11,
                        font: timesRomanFont,
                        maxWidth: width - margin * 2 - 20,
                    })
                    yPosition -= lineHeight
                })
            } else {
                // Campo simples
                addLine(key, String(value))
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