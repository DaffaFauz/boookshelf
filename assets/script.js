const buku = [];

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    tambah();
    form.reset()
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#formubah");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const modal = document
      .querySelector(".modal-body")
      .getAttribute("name");
    ubahBuku(modal);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const cari = document.querySelector("#cari");
  cari.addEventListener("submit", function (event) {
    event.preventDefault();

    cariData()
  });
});

function sembunyi(id) {
  var myModalEl = document.getElementById(id);
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();
}

function tambah() {
  const judul = document.querySelector("#judul").value;
  const author = document.querySelector("#author").value;
  const tahun = Number(document.querySelector("#tahun").value);
  const selesai = document.querySelector("#selesai").checked;

  const getID = +new Date();
  const dataBuku = {
    id: getID,
    title: judul,
    author: author,
    year: tahun,
    isComplete: selesai,
  };

  if (buku.push(dataBuku)) {
    alert("Berhasil Ditambahkan");
  }
  sembunyi("exampleModal");
  document.dispatchEvent(new Event("render"));
  simpan();
}

document.addEventListener("render", function () {
  const blmSelesai = document.querySelector(".belum-dibaca");
  const sdhSelesai = document.querySelector(".sudah-dibaca");
  blmSelesai.innerHTML = "";
  sdhSelesai.innerHTML = "";

  for (const item of buku) {
    const element = tampil(item);
    if (!item.isComplete) {
      blmSelesai.append(element);
    } else {
      sdhSelesai.append(element);
    }
  }
});

function tampil(dataBuku) {
  const judul = document.createElement("h5");
  judul.classList.add("card-title", "judul");
  judul.innerText = dataBuku.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${dataBuku.author}`;

  const tahun = document.createElement("p");
  tahun.innerText = `Tahun terbit: ${dataBuku.year}`;

  const detail = document.createElement("div");
  detail.append(judul, author, tahun);

  const pcs = document.createElement("div");
  pcs.classList.add("card", "mb-3", "p-2", "d-block", "item");
  pcs.setAttribute("id", `buku-${dataBuku.id}`);
  pcs.append(detail);

  if (dataBuku.isComplete) {
    const kembali = document.createElement("button");
    kembali.classList.add("btn", "btn-warning", "me-3");
    kembali.innerText = "Belum selesai dibaca";
    kembali.addEventListener("click", function () {
      dataBuku.isComplete = false;
      document.dispatchEvent(new Event("render"));
      simpan();
    });

    pcs.append(kembali);
  } else {
    const sudah = document.createElement("button");
    sudah.classList.add("btn", "btn-success", "me-3");
    sudah.innerText = "selesai dibaca";
    sudah.addEventListener("click", function () {
      dataBuku.isComplete = true;
      document.dispatchEvent(new Event("render"));
      simpan();
    });

    pcs.append(sudah);
  }
  const hapus = document.createElement("button");
  hapus.classList.add("btn", "btn-danger", "me-3");
  hapus.innerText = "Hapus buku";
  hapus.addEventListener("click", function () {
    if(confirm("Data yang Anda pilih akan dihapus")){
        hapusBuku(dataBuku.id);
    };
  });

  const ubah = document.createElement("button");
  ubah.classList.add("btn", "btn-secondary");
  ubah.innerText = "Ubah buku";
  ubah.setAttribute("data-bs-toggle", "modal");
  ubah.setAttribute("data-bs-target", "#exampleModal1");
  ubah.addEventListener("click", function () {
    let modal = document.querySelector(".modal-body");
    modal.setAttribute("name", `${dataBuku.id}`);
    const judul = (document.querySelector("#judul1").value =
      dataBuku.title);
    const author = (document.querySelector("#author1").value =
      dataBuku.author);
    const tahun = (document.querySelector("#tahun1").value =
      dataBuku.year);
    const selesai = (document.querySelector("#selesai1").checked =
      dataBuku.isComplete);
  });
  pcs.append(hapus, ubah);
  return pcs;
}

function hapusBuku(id) {
  const target = getId(id);
  if (target === -1) return;

  buku.splice(target, 1);
  alert("Buku berhasil dihapus");
  document.dispatchEvent(new Event("render"));
  simpan();
}

function getId(id) {
  for (let index in buku) {
    if (buku[index].id == id) {
      return index;
    }
  }
  return -1;
}

function ubahBuku(id) {
  const dataBuku = JSON.parse(localStorage.getItem(sk) || []);
  let idNew = Number(id);
  const bukuIndex = dataBuku.findIndex((item) => item.id == idNew);

  if (bukuIndex !== -1) {
    const judul = document.querySelector("#judul1").value;
    const author = document.querySelector("#author1").value;
    const tahun = Number(document.querySelector("#tahun1").value);
    const selesai = document.querySelector("#selesai1").checked;

    dataBuku[bukuIndex] = {
      ...dataBuku[bukuIndex],
      title: judul,
      author: author,
      year: tahun,
      isComplete: selesai,
    };
    buku.map((obj) => {
      if (obj.id === idNew) {
        buku[bukuIndex] = {
          ...obj,
          title: judul,
          author: author,
          year: tahun,
          isComplete: selesai,
        };
      }
    });
    localStorage.setItem(sk, JSON.stringify(dataBuku))
        alert("Berhasil diubah");

    document.dispatchEvent(new Event("render"));
  } else {
    alert("ID buku tidak ditemukan");
  }
  sembunyi("exampleModal1");
}

const sk = "Save Data";
function checkStorage() {
  if (typeof Storage == undefined) {
    alert("Browser yang Anda gunakan tidak mendukung web storage");
    return false;
  }
  return true;
}

function simpan() {
  if (checkStorage()) {
    const konversi = JSON.stringify(buku);
    localStorage.setItem(sk, konversi);
    document.dispatchEvent(new Event("simpan"));
  }
}

function ambil() {
  const getData = localStorage.getItem(sk);
  let data = JSON.parse(getData);

  if (data !== null) {
    for (const item of data) {
      buku.push(item);
    }
  }

  document.dispatchEvent(new Event("render"));
}

document.addEventListener("DOMContentLoaded", function () {
  if (checkStorage()) {
    ambil();
  }
});

function cariData() {
  var keyword = document.getElementById('cariData').value;
  const items = document.querySelectorAll(
    "div.belum-dibaca .item, div.sudah-dibaca .item"
  );
  items.forEach(function (buku) {
    const judulBuku = buku.innerHTML.toLowerCase();
    if (judulBuku.includes(keyword)) {
      buku.classList.remove("d-none");
    } else {
      buku.classList.add("d-none");
    }
  });
};
