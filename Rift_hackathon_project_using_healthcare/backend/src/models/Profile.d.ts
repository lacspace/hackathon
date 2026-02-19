import mongoose, { Document } from 'mongoose';
import { IProfile } from '../types';
export interface IProfileDocument extends IProfile, Document {
}
declare const _default: mongoose.Model<IProfileDocument, {}, {}, {}, mongoose.Document<unknown, {}, IProfileDocument, {}, mongoose.DefaultSchemaOptions> & IProfileDocument & Required<{
    _id: string;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProfileDocument>;
export default _default;
//# sourceMappingURL=Profile.d.ts.map