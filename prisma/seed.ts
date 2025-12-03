import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEPARTMENTS = [
    "Computer Science",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics",
    "Business Administration"
];

async function main() {
    console.log('Start seeding ...');

    for (const deptName of DEPARTMENTS) {
        const dept = await prisma.department.upsert({
            where: { name: deptName },
            update: {},
            create: { name: deptName },
        });

        console.log(`Created department: ${dept.name}`);

        // Create 10 mock students for each department
        for (let i = 1; i <= 10; i++) {
            const paid = Math.random() > 0.5 ? (Math.random() > 0.5 ? 5000 : 2500) : 0;
            const status = paid === 5000 ? "COMPLETED" : paid > 0 ? "PARTIAL" : "PENDING";

            await prisma.student.create({
                data: {
                    name: `${deptName} Student ${i}`,
                    departmentId: dept.id,
                    amountPaid: paid,
                    status: status,
                },
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
