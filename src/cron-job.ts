import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MedicineService } from './medicine/medicine.service';

async function runCronJob() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const medicineService = app.get(MedicineService);

  console.log('Starting medicine database update...');
  await medicineService.updateMedicineList();
  console.log('Medicine database update complete.');

  await app.close();
}

runCronJob().catch((err) => {
  console.error('Error running cron job:', err);
  process.exit(1);
});
