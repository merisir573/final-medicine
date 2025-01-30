import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './medicine.interface';

@Injectable()
export class MedicineService {
  private readonly excelUrl = 'https://titck.gov.tr/storage/Archive/2025/dynamicModulesAttachment/AKLST0221.1.2025skrserecetilacvedigerfarmasotikurunler_337b6464-c1b6-44b6-89b5-15d179f2f0e4.xlsx';

  constructor(
    @InjectModel('Medicine') private readonly medicineModel: Model<Medicine>
  ) {
    this.loadMedicines();
  }

  async loadMedicines(): Promise<void> {
    try {
      const response = await axios.default.get(
        this.excelUrl,
        { responseType: 'arraybuffer' }
      );
  
      const workbook = XLSX.read(response.data, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      const medicines = jsonData.slice(4).map((row) => ({
        name: row[0],
        status: row[6],
      })).filter(item => item.name && item.status);

      await this.medicineModel.deleteMany({});
      await this.medicineModel.insertMany(medicines);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  }

  
  async search(name: string, page: number = 1) {
    const limit = 10; 
    const offset = (page - 1) * limit;

    const filteredMedicines = await this.medicineModel
      .find({ name: new RegExp(name, 'i') }) 
      .skip(offset)
      .limit(limit);

    const totalCount = await this.medicineModel.countDocuments({
      name: new RegExp(name, 'i'),
    });

    return {
      status: 'Success',
      data: filteredMedicines,
      totalCount,
    };
  }


  async updateMedicineList() {
    await this.loadMedicines();
    return { status: 'Success', updatedList: 'Medicines updated in database' };
  }
}
