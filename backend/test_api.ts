// Testing API locally

async function testApi() {
  try {
    console.log('--- Testing "All" category ---');
    const resAll = await fetch('http://localhost:3000/api/recipes?page=1&limit=12');
    const dataAll: any = await resAll.json();
    console.log('Response keys:', Object.keys(dataAll));

    if (dataAll.pagination) {
      console.log('Pagination:', dataAll.pagination);
    }

    const categories = ['Salad', 'Chicken', 'Pasta', 'Lunch', 'NonExistent'];
    for (const cat of categories) {
      console.log(`\n--- Testing "${cat}" category ---`);
      const resCat = await fetch(`http://localhost:3000/api/recipes?page=1&limit=12&category=${cat}`);
      const dataCat: any = await resCat.json();
      console.log(`Total recipes for ${cat}:`, dataCat.pagination.total);
    }

  } catch (err: any) {
    console.error('API Error:', err.message);
  }
}

testApi();
