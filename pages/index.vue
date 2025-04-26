<script setup lang="js">
import { ref, reactive } from "vue";
import axios from 'axios';

const endpoint_url = 'http://localhost:3333';

const shift_options = ["Manual", "Automático"];
const year = new Date().getFullYear();
const search = ref();
const formType = ref('create');
const id_to_edit = ref();
  
  const fields = reactive({
  rental_company: '',
  model: '',
  brand: '',
  year: year,
  engine: '',
  doors: 1,
  shift_model: '',
  air_conditioner: false,
});


async function getOne(id) {
  const {data} = await axios.get(`${endpoint_url}/veiculos/${id}`)
  return data || [];
};

async function getAll() {
  const {data} = await axios.get(`${endpoint_url}/veiculos`);
  return data || [];
};

async function createOne(payload) {
  await axios.post(`${endpoint_url}/veiculos`, payload);
};

async function deleteOne(id) {
  await axios.delete(`${endpoint_url}/veiculos/${id}`);
};

async function updateOne(id, payload) {
  await axios.put(`${endpoint_url}/veiculos/${id}`, payload);
}

async function onSearchClick() {
  if (!search.value) return;
  const response = await getOne(parseInt(search.value));
  table_data.rows.value = [response];
};

async function getTableData() {
  const data = await getAll()
  console.log(data);
  table_data.rows.value = data.map((row) => {
    return {
      ...row,
      air_conditioner: translateBoolToStr(row.air_conditioner),
      createdAt: formatDate(row.createdAt),
      updatedAt: formatDate(row.updatedAt,),
    };
  });
}

function clearFields() {
  id_to_edit.value = null;
  formType.value = 'create'

  fields.rental_company = '';
  fields.model = '';
  fields.brand = '';
  fields.year = year;
  fields.engine = '';
  fields.doors = 1;
  fields.shift_model = '';
  fields.air_conditioner = false;
}

function getPayload() {
  return {
    rental_company: fields.rental_company,
    model: fields.model,
    brand: fields.brand,
    year: fields.year,
    engine: fields.engine,
    doors: fields.doors,
    shift_model: fields.shift_model,
    air_conditioner: fields.air_conditioner,
  };
};

async function onSubmit(type) {
  const payload = getPayload();
  if (type === 'create') {
    await createOne(payload);
    await getTableData();
    clearFields();
    return;
  }
  if (type === 'edit') {
    const id = id_to_edit.value;
    await updateOne(id, payload);
    await getTableData();
    clearFields();
  }
};

async function onEditClick(id) {
  const response = await getOne(id);

  fields.rental_company = response.rental_company;
  fields.model = response.model;
  fields.brand = response.brand;
  fields.year = response.year;
  fields.engine = response.engine;
  fields.doors = response.doors;
  fields.shift_model = response.shift_model;
  fields.air_conditioner = response.air_conditioner;


  id_to_edit.value = id;
  formType.value = 'edit';
};

async function onDeleteClick(id) {
  await deleteOne(id);
  await getTableData();
};

const translateBoolToStr = (value) => (value ? "Sim" : "Não");

function formatDate(date) {
  if (!date) return;
  const d = new Date(date);
  if (!d) return;
 
  const days = d.getDay().toString().padStart(2, '0');
  const months = d.getMonth().toString().padStart(2, '0');

  return `${days}/${months}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
};


const table_data = {
  rows: ref([]),
  columns: [
    { key: "id", label: "Id", sortable: true },
    { key: "rental_company", label: "Locadora" },
    { key: "model", label: "Modelo" },
    { key: "brand", label: "Marca" },
    { key: "year", label: "Ano", sortable: true, direction: "desc" },
    { key: "engine", label: "Motor" },
    { key: "doors", label: "Portas", sortable: true },
    { key: "shift_model", label: "Câmbio" },
    { key: "air_conditioner", label: "Ar Condicionado", sortable: true },
    { key: "createdAt", label: "Data de Criação", sortable: true },
    { key: "updatedAt", label: "Data de Modificação", sortable: true },
    { key: "actions" },
  ],
  actions: (row) => [
    [
      {
        label: "Edit",
        icon: "i-heroicons-pencil-square-20-solid",
        click: () => onEditClick(row.id),
      },
      {
        label: "Delete",
        icon: "i-heroicons-trash-20-solid",
        click: () => onDeleteClick(row.id),
      },
    ],
  ],
}

const submitButtonLabel = computed(() => {
  if (formType.value === 'create') {
    return 'Adicionar';
  }
  if (formType.value === 'edit') {
    return 'Salvar Edição';
  }
});

onMounted(async () => {
  getTableData();
});

</script>

<template>
  
    <UCard class="ma-lg align-center">
      <h2> CRUD de Veículos</h2>
    <h3> Adicionar Novo Veículo </h3>

     <UForm :state="fields" class="ma-md" @submit="onSubmit(formType)">
      <UFormGroup label="Locadora:" name="rental_company" class="input ma-md">
        <UInput v-model="fields.rental_company" />
      </UFormGroup>

      <UFormGroup label="Modelo:" name="model" class="input ma-md">
        <UInput v-model="fields.model" />
      </UFormGroup>

      <UFormGroup label="Marca:" name="brand" class="input ma-md">
        <UInput v-model="fields.brand" />
      </UFormGroup>

      <UFormGroup label="Ano:" name="year" class="input ma-md">
        <UInput v-model="fields.year" type="number" :max="year + 1" :min="1885"> 
          <span>min 1885 / max: {{ year + 1 }}</span>
        </UInput>

      </UFormGroup>

      <UFormGroup label="Motor:" name="engine" class="input ma-md">
        <UInput v-model="fields.engine" />
      </UFormGroup>

      <UFormGroup label="Portas:" name="doors" class="input ma-md">
        <UInput v-model="fields.doors" type="number" />
      </UFormGroup>

      <UFormGroup label="Câmbio:" name="shift_model" class="input ma-md">
        <USelect v-model="fields.shift_model" :options="shift_options" />
      </UFormGroup>

      <UFormGroup label="Ar Condicionado:" name="air_conditioner" class="input ma-md">
        <UCheckbox v-model="fields.air_conditioner" class="ma-md justify-center" />
      </UFormGroup>
      
      <div class="action-btn">
        <UButton type="submit" :label="submitButtonLabel" class="ma-lg" />
        <UButton label="Atualizar Listagem" @click="getTableData()" class="ma-lg" />
      </div>
    </UForm>
  </UCard>
  <UCard class="ma-lg">
    <div class="input ma-md">
      <label>Id para pesquisa:</label>
      <UInput class="ma-md" v-model="search" type="number" />
      <UButton class="ma-md" label="Buscar" @click="onSearchClick()" />
    </div>
    <UTable :columns="table_data.columns" :rows="table_data.rows.value"> 
      <template #actions-data="{ row }">
       <UDropdown :items="table_data.actions(row)">
         <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
       </UDropdown>
      </template>
    </UTable>
  </UCard>
</template>

<style>
.input {
  width: 84vw;
  margin: 4px;
}

.justify-center {
  display: flex;
  justify-content: center;
}

.align-center {
  display: flex;
  justify-self: center;
}

.ma-sm {
  margin: 6px;
}

.ma-md {
  margin: 12px;
}

.ma-lg {
  margin: 24px;
}

.action-btn {
  display: flex;
  flex-direction: column;
}

.action-btn > button {
  width: fit-content;
}
</style>
