import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface ExportHeader {
    id: string
    label: string
}

export interface Field {
    id?: string
    label?: string
    value?: string
}

export const exportTableToCSV = (datas: any[], headers: ExportHeader[], filename: string) => {
    if (!headers?.length) return
    const separator = ','
    const labels = headers.map(header => header.label)
    const csvContent = [
        labels.join(separator),
        ...datas.map(row =>
            headers.map(header => {
            let value = row?.[header.id]
            return `"${(value ?? '').toString().replace(/"/g, '""')}"`
            }).join(separator)
        )
    ].join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const exportTableToExcel = (datas: any[], headers: ExportHeader[], filename: string) => {
    if (!headers?.length) return
    
    const formattedData = datas.map(row => {
        const formattedRow: Record<string, any> = {}
        headers.forEach(header => {
        formattedRow[header.label] = row?.[header.id]
        })
        return formattedRow
    })
    
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    
    const columnWidths = headers.map(header => {
        const labelLength = header.label.length
        const maxContentLength = Math.max(
        ...formattedData.map(row => String(row[header.label] ?? '').length)
        )
        return { wch: Math.max(labelLength, maxContentLength) + 2 }
    })
    
    worksheet['!cols'] = columnWidths
    
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Export')
    XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export const exportTableToPDF = (datas: any[], headers: ExportHeader[], filename: string) => {
    if (!headers?.length) return

    const doc = new jsPDF()

    const tableHeaders = headers.map(h => h.label)
    const tableBody = datas.map(row =>
        headers.map(h => row?.[h.id] ?? '')
    )

    autoTable(doc, {
        head: [tableHeaders],
        body: tableBody,
        styles: { fontSize: 10, cellPadding: 3, lineColor: [249, 249, 249], lineWidth: 0.5 },
        headStyles: { fillColor: [249, 249, 249], textColor: [0, 0, 0], fontStyle: 'bold' },
        bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [249, 249, 249], lineWidth: 0.5 },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        didParseCell: (data) => {
          if (data.section === 'body') {
            data.cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.5, left: 0 }
          }
        },
        margin: { top: 20 }
    })

    doc.save(`${filename}.pdf`)
}

export const exportInvoiceToPDF = (fields: Field[], tableDatas: string [][], pTableDatas: { [key: string]: any }, filename: string, title?: string) => {
    const doc = new jsPDF()
    const marginX = 20
    let cursorY = 20

    // title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title ?? "", marginX, cursorY)
    cursorY += 10

    // fields
    const columnCount = 3
    const columnWidth = (doc.internal.pageSize.getWidth() - marginX * 2) / columnCount
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    fields.forEach((item, index) => {
        const col = index % columnCount
        const roww = Math.floor(index / columnCount)
        const x = marginX + col * columnWidth
        const y = cursorY + roww * 16

        const { label= "", value="" } = item

        doc.setTextColor(120)
        doc.text(label, x, y)

        doc.setTextColor(0)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text(value.toString(), x, y + 7)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
    })
    cursorY += Math.ceil(fields.length / columnCount) * 15 + 2

    // table
    if (tableDatas.length > 0) {
        const tableCols = tableDatas[0].length
        const tableColWidths = Array(tableCols).fill(0).map((_, colIndex) => {
            const maxWidth = Math.max(
              ...tableDatas.map(row => doc.getTextWidth(String(row[colIndex]))),
            )
            return maxWidth + 6
        })
        const cellHeight = 8
    
        tableDatas.forEach((rowData) => {
            rowData.forEach((cell, colIndex) => {
                const x = marginX + tableColWidths.slice(0, colIndex).reduce((a, b) => a + b, 0)
                const colWidth = tableColWidths[colIndex]
                doc.setDrawColor(211, 211, 211)
                doc.setLineWidth(0.25)
                doc.rect(x, cursorY, colWidth, cellHeight)
                doc.setTextColor(0)
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(10)
                doc.text(String(cell), x + 2, cursorY + 6)
            })
            cursorY += cellHeight
        })
    }

    // pTable
    if (pTableDatas['headers']) {
        const tableHeaders = pTableDatas['headers'].map((h: { [key: string]: string }) => h['label'])
        const tableBody = pTableDatas['rows'].map((row: { [key: string]: string }) =>
            pTableDatas['headers'].map((h: { [key: string]: string }) => row?.[h['id']] ?? '')
        )
        const tableFooters = pTableDatas['footerRows'].map((row: { [key: string]: string }) =>
            pTableDatas['headers'].map((h: { [key: string]: string }) => row?.[h['id']] ?? '')
        )

        autoTable(doc, {
            head: [tableHeaders],
            body: tableBody,
            foot: tableFooters,
            startY: cursorY + 5,
            styles: { fontSize: 10, cellPadding: 3, lineColor: [249, 249, 249], lineWidth: 0.5 },
            headStyles: { fillColor: [249, 249, 249], textColor: [0, 0, 0], fontStyle: 'bold' },
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineColor: [235, 235, 235], lineWidth: 0.5 },
            footStyles: { fillColor: [249, 249, 249], textColor: [0, 0, 0], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [255, 255, 255] },
            didParseCell: (data) => {
            if (data.section === 'body') {
                data.cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.5, left: 0 }
            }
            },
            margin: { top: 20 }
        })
    }

    // const finalY = (doc as any).lastAutoTable.finalY
    // cursorY = finalY + 10

    doc.save(`${filename}.pdf`)
}