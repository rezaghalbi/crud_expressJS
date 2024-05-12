document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();

  // buat button tambah data
  document.getElementById("addButton").addEventListener("click", async () => {
    $("#addModal").modal("show");
  });

  // form buat tambah data yang ada di modals
  document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newData = {
      nik: formData.get("nik"),
      nama_lengkap: formData.get("nama"),
      alamat: formData.get("alamat"),
      pekerjaan: formData.get("pekerjaan"),
    };
    await postData(newData);
    await fetchData();
    $("#addModal").modal("hide");
    e.target.reset();
  });

  // form buat tambah dada biar tambah gede
  document.addEventListener("submit", async (e) => {
    if (e.target && e.target.id === "editForm") {
      e.preventDefault();
      const formData = new FormData(e.target);
      const nik = formData.get("nik");
      const newData = {
        nama_lengkap: formData.get("nama"),
        alamat: formData.get("alamat"),
        pekerjaan: formData.get("pekerjaan"),
      };
      await editData(nik, newData);
      $("#editModal").modal("hide");
      e.target.reset();
    }
  });
});

// main API buat nampilin dada(oppai)
async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/");
    const data = await response.json();
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";
    data.payload.datas.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.nik}</td>
        <td>${row.nama_lengkap}</td>
        <td>${row.alamat}</td>
        <td>${row.pekerjaan}</td>
        <td>
          <button onclick="showEditModal('${row.nik}')" class="btn btn-info btn-sm">Edit</button>
          <button onclick="deleteData('${row.nik}')" class="btn btn-danger btn-sm">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// untuk show modals dari edit data
async function showEditModal(nik) {
  try {
    const response = await fetch(`http://localhost:3000/search?nik=${nik}`);
    const data = await response.json();
    const resident = data.payload.datas[0];
    document.getElementById("editModal").innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit Data</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form id="editForm">
              <div class="form-group">
                <label for="nik">NIK:</label>
                <input type="text" class="form-control" id="nik" name="nik" value="${resident.nik}" required readonly>
              </div>
              <div class="form-group">
                <label for="nama">Nama Lengkap:</label>
                <input type="text" class="form-control" id="nama" name="nama" value="${resident.nama_lengkap}" required>
              </div>
              <div class="form-group">
                <label for="alamat">Alamat:</label>
                <input type="text" class="form-control" id="alamat" name="alamat" value="${resident.alamat}" required>
              </div>
              <div class="form-group">
                <label for="pekerjaan">Pekerjaan:</label>
                <input type="text" class="form-control" id="pekerjaan" name="pekerjaan" value="${resident.pekerjaan}" required>
              </div>
              <button type="submit" class="btn btn-primary">Edit Data</button>
            </form>
          </div>
        </div>
      </div>
    `;
    $("#editModal").modal("show");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// buat input atau nambahin dada eh
async function postData(data) {
  try {
    const response = await fetch("http://localhost:3000/inputData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

// ini edit data nya
async function editData(nik, newData) {
  try {
    const response = await fetch(`http://localhost:3000/updateData/${nik}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    await response.json();
    await fetchData();
  } catch (error) {
    console.error("Error editing data:", error);
  }
}

// API tobrut killer atau hapus dada
async function deleteData(nik) {
  try {
    const response = await fetch(`http://localhost:3000/deleteData/${nik}`, {
      method: "DELETE",
    });
    await response.json();
    await fetchData();
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}
