import { Schema, type Document, model } from 'mongoose'

interface IHistoryDocument extends Document {
  type: string
  message: string
  createdAt: Date
}

const historySchema = new Schema<IHistoryDocument>({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
})

export const HistoryModel = model<IHistoryDocument>('History', historySchema)
