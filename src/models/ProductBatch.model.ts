import mongoose, {Schema} from 'mongoose';

const ProductBatchSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
    },
    availableStock: {type: Number, min: 0},
    purchasePrice: {type: Number, min: 0},
    unitPrice: {type: Number, min: 0},
    // updatedBy: {
    //   type: String,
    // },
    // createdBy: {
    //   type: String,
    // },
    type: {
      type: String,
      enum: ['BULK', 'UNIT'],
      default: 'UNIT',
    },
  },
  {timestamps: true}
);
ProductBatchSchema.index({businessId: 1});

ProductBatchSchema.index({createdAt: 1});

const ProductBatch = mongoose.model('ProductBatch', ProductBatchSchema);

export default ProductBatch;
