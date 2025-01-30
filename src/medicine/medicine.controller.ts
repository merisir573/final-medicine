import { Controller, Get, Query } from '@nestjs/common';
import { MedicineService } from './medicine.service';

@Controller('medicine/v1')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get('search')
  searchMedicine(
    @Query('name') name: string,
    @Query('page') page: number = 1, 
  ) {
    if (!name) {
      return { status: 'Error', message: 'Query parameter "name" is required' };
    }
    return this.medicineService.search(name, page);
  }
  

  @Get('update')
  async updateMedicineList() {
    try {
      const result = await this.medicineService.updateMedicineList();
      return result;
    } catch (error) {
      return { status: 'Error', message: error.message };
    }
  }
}