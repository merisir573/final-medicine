import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './medicine.interface';
import * as cheerio from 'cheerio'; // For web scraping

@Injectable()
export class MedicineService {
  private readonly baseUrl = 'https://www.titck.gov.tr/dinamikmodul/43';

  constructor(
    @InjectModel('Medicine') private readonly medicineModel: Model<Medicine>
  ) {
    this.updateMedicineList();
  }

  async getLatestExcelUrl(): Promise<string | null> {
    try {
      const response = await axios.default.get(this.baseUrl);
      const $ = cheerio.load(response.data);

      // Find the first link that contains ".xlsx"
      const latestExcel = $('a[href$=".xlsx"]').first().attr('href');

      if (!latestExcel) {
        console.error('No Excel file found on the page.');
        return null;
      }

      // Construct full URL (if it's a relative path)
      const fullUrl = latestExcel.startsWith('http')
        ? latestExcel
        : `https://www.titck.gov.tr${latestExcel}`;

      return fullUrl;
    } catch (error) {
      console.error('Error fetching latest Excel URL:', error);
      return null;
    }
  }

  async loadMedicines(): Promise<void> {
    try {
      const excelUrl = await this.getLatestExcelUrl();
      if (!excelUrl) {
        console.error('Failed to get latest Excel file URL.');
        return;
      }

      const response = await axios.default.get(excelUrl, { responseType: 'arraybuffer' });
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
      console.log('Medicine database updated successfully.');
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
