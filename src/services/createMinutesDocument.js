import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeightRule,
  LevelFormat,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx'
import { clubConfig } from '../config/clubConfig.js'
import { buildMinutesModel } from './generateMinutes.js'

const COLORS = {
  navy: '003B6F',
  loyalBlue: '004165',
  maroon: '772432',
  white: 'FFFFFF',
}
const noBorder = { color: COLORS.white, size: 0, style: BorderStyle.NONE }
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder }

function titleBand(model) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: noBorders,
    rows: [
      new TableRow({
        height: { value: 1650, rule: HeightRule.ATLEAST },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            shading: { fill: COLORS.navy, type: ShadingType.CLEAR, color: 'auto' },
            margins: { top: 260, bottom: 260, left: 320, right: 320 },
            borders: noBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 80 },
                children: [new TextRun({ text: model.title, bold: true, color: COLORS.white, font: 'Arial', size: 40 })],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 40 },
                children: [new TextRun({ text: model.date, color: COLORS.white, font: 'Arial', size: 28 })],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: `Meeting No. ${model.meetingNumber}`, color: COLORS.white, font: 'Arial', size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function numberedHeading(section) {
  return new Paragraph({
    keepNext: true,
    numbering: { reference: 'minutes-sections', level: 0 },
    spacing: { before: 220, after: 90 },
    children: [new TextRun({ text: `${section.title}:`, font: 'Arial', size: 22 })],
  })
}

function detailBullet(bullet) {
  const children = []
  if (bullet.lead) children.push(new TextRun({ text: bullet.lead, bold: true, font: 'Arial', size: 22 }))
  if (bullet.text) children.push(new TextRun({ text: bullet.text, font: 'Arial', size: 22 }))
  if (bullet.promptText) children.push(new TextRun({ text: bullet.promptText, color: COLORS.maroon, italics: true, font: 'Arial', size: 22 }))
  return new Paragraph({
    numbering: { reference: 'minutes-bullets', level: 0 },
    spacing: { after: 45 },
    children,
  })
}

export function createMinutesDocument(meeting, posterData) {
  const model = buildMinutesModel(meeting, posterData, clubConfig)
  const body = [
    titleBand(model),
    new Paragraph({ spacing: { before: 260, after: 80 }, children: [new TextRun({ text: model.introduction[0], font: 'Arial', size: 22 })] }),
    new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: model.introduction[1], font: 'Arial', size: 22 })] }),
    new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: model.completionNote, color: COLORS.loyalBlue, italics: true, font: 'Arial', size: 20 })] }),
  ]

  model.sections.forEach((section) => {
    body.push(numberedHeading(section), ...section.bullets.map(detailBullet))
  })
  body.push(new Paragraph({
    spacing: { before: 220 },
    children: [new TextRun({ text: model.close, font: 'Arial', size: 22 })],
  }))

  return new Document({
    creator: clubConfig.name,
    title: model.title,
    description: `Meeting ${model.meetingNumber} minutes pre-filled from the generated agenda`,
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: '000000' },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'minutes-sections',
          levels: [{
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 360, hanging: 360 } } },
          }],
        },
        {
          reference: 'minutes-bullets',
          levels: [{
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 300 } } },
          }],
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 720, right: 720, bottom: 720, left: 720, header: 288, footer: 288 },
        },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: model.footer, color: COLORS.loyalBlue, font: 'Arial', size: 18 })],
          })],
        }),
      },
      children: body,
    }],
  })
}
