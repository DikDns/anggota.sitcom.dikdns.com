const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const membersContainer = document.querySelector(".members-container");
let members = [];

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

async function main() {
  const response = await getMembers(searchInput.value);
  members = response.data
    // Sort berdasarkan status keaktifan
    .sort((ma, mb) => (ma.status === mb.status ? -1 : 1))
    // Sort berdasarkan angkatan terbaru
    .sort((ma, mb) =>
      ma.status === mb.status ? (ma.angkatan > mb.angkatan ? -1 : 1) : 0
    )
    // Sort berdasarkan kelas
    .sort((ma, mb) =>
      ma.status === mb.status && ma.angkatan === mb.angkatan
        ? ma.kelas < mb.kelas
          ? -1
          : 1
        : 0
    )
    // Sort berdasarkan nama abjad
    .sort((ma, mb) =>
      ma.kelas === mb.kelas &&
      ma.status === mb.status &&
      ma.angkatan === mb.angkatan
        ? ma.nama < mb.nama
          ? -1
          : 1
        : 0
    );
  console.log(members);
  updateUI(members);
}

function getMembers(search) {
  // Loading
  updateLoading(true);
  // Return Fetch with searching the value from parameter
  return fetch(
    "https://sitcom-api.vercel.app/api/member?token=62dcebd26ec9b1b06346bc40&search=" +
      search
  )
    .finally(() => {
      updateLoading(false);
    })
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

function updateLoading(condition = true) {
  if (condition) {
    searchBtn.disabled = true;
    searchBtn.innerHTML = showLoading();
    const loadingCards = showCardsLoading();
    let loadingCard = ``;
    loadingCards.forEach((card) => {
      loadingCard += card;
    });
    membersContainer.innerHTML = loadingCard;
  } else {
    searchBtn.disabled = false;
    searchBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass me-2"></i> Search`;
  }
}

function updateUI(members) {
  let cards = "";
  members.forEach((member) => (cards += showCards(member)));
  membersContainer.innerHTML = cards;
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
  return `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
    Loading...`;
}

function showCardsLoading(n = 1) {
  const loadingCard = `
    <div class="col-md-3 my-2">
      <div class="card h-100" aria-hidden="true">
        <div class="card-body">
          <div class="h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title placeholder-wave">
                <span class="placeholder placeholder-lg col-12"></span>
              </h5>
              <p class="card-text placeholder-wave">
                <span class="placeholder col-3"></span>
                <span class="placeholder col-3"></span>
                <span class="placeholder col-3"></span>
              </p>
              <p class="card-text placeholder-wave mb-3 font-monospace">
                <span class="placeholder col-12"></span>
              </p>
            </div>
            <div>
              <a href="#" tabindex="-1" class="disabled placeholder col-3"></a>
            </div>
          </div>
        </div>
        <div class="card-footer text-muted placeholder-wave">
          <span class="placeholder placeholder-xs col-12 bg-secondary"></span>
        </div>
      </div>
    </div>
  `;
  const arr = [];

  for (let i = 0; i < n; i++) {
    arr.push(loadingCard);
  }

  return arr;
}

function showCards(member) {
  return `<div class="col-md-3 my-2">
  <div class="card h-100">
    <div class="card-body">
      <div class="h-100 d-flex flex-column justify-content-between">
        <div>
          <h5 class="card-title nama" id="nama">${member.nama}</h5>
          <p class="card-text">
            ${member.kelas} | ${member.jabatan} | ${member.angkatan}
          </p>
          <p class="card-text fs-6 mb-2 font-monospace">
            "${member.deskripsi}"
          </p>
        </div>
        <div>
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
      </div>
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
      member.status === "aktif"
        ? "success"
        : member.status === "keluar"
        ? "danger"
        : "secondary"
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

try {
  main();
} catch (error) {
  console.log(error);
}
