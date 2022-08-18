const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
let members = [];

async function main() {
  const response = await getMembers(searchInput.value);
  members = response.data;
  updateUI(members);
}

try {
  main();
} catch (error) {
  console.log(error);
}

searchBtn.addEventListener("click", async function () {
  try {
    main();
  } catch (error) {
    console.log(error);
  }
});

searchInput.addEventListener("keyup", async function (e) {
  if (e.key === "Enter") {
    try {
      main();
    } catch (error) {
      console.log(error);
    }
  }
});

document.addEventListener("click", async function (e) {
  // If the user click the modal-detail-button
  if (e.target.classList.contains("modal-detail-button")) {
    try {
      const id = e.target.dataset.id;
      const memberDetail = getMemberDetail(id);
      updateUIDetail(memberDetail);
    } catch (error) {
      document.querySelector(".modal-body").innerHTML = showError(error);
    }
  }
});

function getMembers(search) {
  // Return Fetch with searching the value from parameter
  return fetch(
    "https://sitcom-api.vercel.app/api/member?token=62dcebd26ec9b1b06346bc40&search=" +
      search
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (!response.success) {
        throw new Error(response.msg);
      } else {
        return response;
      }
    });
}

function updateUI(members) {
  let cards = "";
  members.forEach((member) => (cards += showCards(member)));
  document.querySelector(".members-container").innerHTML = cards;
}

function getMemberDetail(id) {
  for (let i = 0; i < members.length; i++) {
    if (members[i]._id === id) {
      return members[i];
    }
  }
}

function updateUIDetail(member) {
  const modalBody = document.querySelector(".modal-body");
  const memberDetails = showMemberDetail(member);
  modalBody.innerHTML = memberDetails;
}

function showError(error) {
  return `<div class="alert alert-danger" role="alert">
        ${error}
  </div`;
}

function showLoading() {
  return `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...`;
}

function showCards(member) {
  return `<div class="col-md-3 my-2">
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title nama" id="nama">${member.nama}</h5>
      <p class="card-text">${member.kelas} | ${member.jabatan} | ${
    member.angkatan
  }</p>
      <a
        href="#"
        class="card-link modal-detail-button"
        data-bs-toggle="modal"
        data-bs-target="#detailModal"
        data-id="${member._id}"
      >
        Detail</a
      >
    </div>
    <div class="card-footer text-muted" id="updatedAt">${new Date(
      member.updatedAt
    ).toLocaleString()}</div>
  </div>
</div>`;
}

function showMemberDetail(member) {
  return `<div
  class="text-center d-flex justify-content-center align-items-center"
>
  <h2 class="text-capitalize" id="nama">${member.nama}</h2>
  <span
    class="text-lowercase badge text-bg-${
      member.status === "alumni" ? "secondary" : "success"
    } ms-2"
    id="status"
    >${member.status}</span
  >
</div>
<p class="text-center" id="deskripsi">
${member.deskripsi}
</p>
<ul class="list-group">
  <li class="list-group-item fw-bold text-capitalize" id="jabatan">
  ${member.jabatan}
  </li>
  <li class="list-group-item fw-bold text-capitalize" id="kelas">
    Kelas ${member.kelas}
  </li>
  <li class="list-group-item fw-bold text-capitalize" id="asalSmp">
    Berasal dari ${member.asalSmp}
  </li>
  <li class="list-group-item fw-bold text-capitalize" id="hobi">
    Hobinya ${member.hobi}
  </li>
  <li class="list-group-item fw-bold text-capitalize" id="angkatan">
    Angkatan: ${member.angkatan}
  </li>
</ul>`;
}
