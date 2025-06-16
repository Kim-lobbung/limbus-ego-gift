//설정창 바깥 선택 시 닫기
window.onclick = function(event) {
  var setting_box = document.getElementById("setting_box");
  if (setting_box.style.display === "block" && event.target == setting_box) {
    if (setting_box.classList.contains("show")) {
      setting_box.classList.remove("show");
      setting_box.classList.add("hide");
      setTimeout(() => {
        setting_box.style.display = "none";
        setting_box.classList.remove("hide");
      }, 300);
    }
  }
}

//설정창 팝업
function setting_popup() {
  const setting_box = document.getElementById("setting_box");
  if (setting_box.classList.contains("show")) {
    setting_box.classList.remove("show");
    setting_box.classList.add("hide");
    setTimeout(() => {
      setting_box.style.display = "none";
      setting_box.classList.remove("hide");
    }, 300);
  } else {
    setting_box.style.display = "block";
    requestAnimationFrame(() => {
      setting_box.classList.add("show");
    });
  }
}

//랜덤 에고 뽑기
function applyRandomEgoGift() {
  const egoList = Array.from(document.getElementsByClassName("main-ego"));
  if (egoList.length === 0) return;

  const randomEgo = egoList[Math.floor(Math.random() * egoList.length)];

  const classes = Array.from(randomEgo.classList);
  const egoClass  = classes.find(cls => cls.startsWith("ego-"));
  const tierClass = classes.find(cls => cls.startsWith("tier"));
  const typeClass = classes.find(cls => cls.startsWith("type"));

  const target = document.getElementById("random_img");

  target.className = "egoback";
  if (egoClass)  target.classList.add(egoClass);
  if (tierClass) target.classList.add(tierClass);
  if (typeClass) target.classList.add(typeClass);

  if (egoClass)  document.getElementById("random_preload_ego").src = `images/egogift/${egoClass.substring(4)}.webp`;
  if (tierClass) document.getElementById("random_preload_tier").src = `images/ui/${tierClass}.webp`;
  if (typeClass) document.getElementById("random_preload_type").src = `images/ui/${typeClass}.webp`;
}

// 이미지 로딩, 저장된 설정 불러오기
window.onload = function() {
  this.applyRandomEgoGift();
  const progressBar = document.getElementById("loading_progress");
  const egobackElements = Array.from(document.getElementsByClassName("egoback"));
  let loadedCount = 0;
  const totalImages = egobackElements.length;

  egobackElements.forEach((element) => {
    const classes = Array.from(element.classList);
    const egoClass = classes.find(cls => cls.startsWith("ego-"));
    const tierClass = classes.find(cls => cls.startsWith("tier"));
    const typeClass = classes.find(cls => cls.startsWith("type"));
    const num_ref = egoClass?.substring(4);
    if (!num_ref) return;

    const ego_img = document.createElement("div");
    element.appendChild(ego_img);
    ego_img.style.cssText = `
    height: 100%;
    width: 100%;
    background-image: url(images/egogift/${num_ref}.webp);
    background-size: 73% 73%;
    background-repeat: no-repeat;
    background-position: center 42%;
    `;

    const preloadImg = new Image();
    preloadImg.onload = () => {
      loadedCount++;
    if (progressBar) progressBar.style.width = `${Math.round((loadedCount / totalImages) * 100)}%`;
      if (loadedCount === totalImages) {
        this.delete_loading();
        if (progressBar) progressBar.style.width = "100%";
      }
    };
    preloadImg.onerror = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        document.getElementById("loading_box").style.display = "none";
      }
    };
    preloadImg.src = `images/egogift/${num_ref}.webp`;

    if (tierClass) {
      const tier_img = document.createElement("div");
      ego_img.appendChild(tier_img);
      tier_img.style.cssText = `
      height: 50%;
      width: 34%;
      margin: 0 auto auto 0;
      background-image: url(images/ui/${tierClass}.webp);
      background-size: auto 69%;
      background-repeat: no-repeat;
      background-position: center 20%;
      `;
    }

    if (typeClass) {
      const type_img = document.createElement("div");
      ego_img.appendChild(type_img);
      type_img.style.cssText = `
      height: 28%;
      width: 30%;
      margin: 20% 1% 1% auto;
      background-image: url(images/ui/${typeClass}.webp);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center bottom;
      `;
    }
  });

  if (localStorage.getItem("name_check") === "none") {
    document.getElementById("name_check").checked = false;
    name_check();
  }

  const gridSet = +localStorage.getItem("grid_set");
  if (gridSet) {
    const grid_countnum = document.getElementById("grid_count");
    grid_countnum.innerHTML = gridSet;
    const grid = document.getElementsByClassName("egolist")[0];
    grid.style.gridTemplateColumns = `repeat(${gridSet}, 1fr)`;
    const egobox = document.getElementById("egobox");
    egobox.style.maxWidth = (650 + (gridSet - 5) * 125) + "px";
  }

  if (localStorage.getItem("filter_naming") === "none") {
    document.getElementById("filter_naming").checked = false;
    filter_naming();
  }
}

//로딩창 제거
function delete_loading() {
  const loadingBox = document.getElementById("loading_box");
  loadingBox.classList.add("fade-out");
  setTimeout(() => {
    loadingBox.style.display = "none";
  }, 300);
}

// 설정 함수
function toggleDisplaySetting(checkboxId, className, storageKey, displayOn = "block") {
  const checked = document.getElementById(checkboxId).checked;
  const targets = document.getElementsByClassName(className);
  const displayValue = checked ? displayOn : "none";

  for (let i = 0; i < targets.length; i++) {
    targets[i].style.display = displayValue;
  }

  localStorage.setItem(storageKey, displayValue);
}

// 에깊 이름 표시 여부
function name_check() {
  toggleDisplaySetting("name_check", "egoname", "name_check", "block");
}

//필터 표기 방식 변경
function filter_naming() {
  toggleDisplaySetting("filter_naming", "filter_name", "filter_naming", "inline");
}

//표시 에깊 개수
function grid_check(updown) {
  const grid = document.getElementsByClassName("egolist")[0];
  const currentCount = getComputedStyle(grid).gridTemplateColumns.split(" ").length;

  let newCount = currentCount;
  if (updown === "up" && currentCount < 10) newCount++;
  else if (updown === "down" && currentCount > 1) newCount--;

  grid.style.gridTemplateColumns = `repeat(${newCount}, 1fr)`;

  const egobox = document.getElementById("egobox");
  egobox.style.maxWidth = `${650 + (newCount - 5) * 125}px`;

  document.getElementById("grid_count").innerText = newCount;
  localStorage.setItem("grid_set", newCount);

  const blanks = Array.from(document.getElementsByClassName("blank"));
  blanks.forEach(blank => {
    blank.style.gridColumn = `1 / ${newCount + 1}`;
  });
}

//에깊 필터
function filter_div() {
  this.sort_type_egogift();
  
  const filter_check = Array.from(document.getElementsByClassName("filterbutton"));
  let filter_check_cnt = 0;
  const filter_check_type = [];
  for (let i = 0; i < filter_check.length; i++) {
    if (filter_check[i].getElementsByTagName("input")[0].checked) {
      filter_check_type[filter_check_cnt] = filter_check[i].getElementsByTagName("input")[0].id.substring(6, 12);
      filter_check_cnt++;
    }
    else {
    }
  }
  
  const filter_div = Array.from(egobox.getElementsByClassName("main-ego"));
  const filter_parent = Array.from(egobox.getElementsByClassName("main-ego")).map(div => div.parentNode);
  const filter_blank = egobox.getElementsByClassName("blank");
  if (filter_check_cnt === 0) {
    this.show_all();
    this.sort_egogift();
    this.remove_blank();
  }
  else {
    this.hidden_all();
    for (let j = 0; j < filter_check_cnt; j++) {
      for (let k = 0; k < filter_div.length; k++) {
        if (filter_div[k].classList.contains(filter_check_type[j])) {
          filter_parent[k].style.display = "block";
        }
        else {
        }
      }
      for (let l = 0; l < filter_blank.length; l++) {
        if (filter_blank[l].classList.contains(filter_check_type[j])) {
          filter_blank[l].style.display = "block";
        }
        else {
        }
      }
    }
  }
}

function show_all() {
  const egobox = document.getElementById("egobox");
  const filter_div = Array.from(egobox.getElementsByClassName("main-ego"));
  filter_div.forEach(div => {
    div.parentNode.style.display = "block";
  });
}

//필터 초기화
function filter_clear() {
  const clearbutton = document.getElementsByClassName("clearbutton");
  setTimeout(function() {
    clearbutton[0].getElementsByTagName("input")[0].checked = false;
  }, 250);
  const filter_check = Array.from(document.getElementsByClassName("filterbutton"));
  filter_check.forEach(el => {
    el.getElementsByTagName("input")[0].checked = false;
  });
  this.show_all();
  this.sort_egogift();
  this.remove_blank();
}

function hidden_all() {
  const egobox = document.getElementById("egobox");
  const filter_div = Array.from(egobox.getElementsByClassName("main-ego"));
  const filter_parent = filter_div.map(div => div.parentNode);
  for (let i = 0; i < filter_div.length; i++) {
    filter_parent[i].style.display = "none";
  }
  var filter_blank = egobox.getElementsByClassName("blank");
  for (let i = 0; i < filter_blank.length; i++) {
    filter_blank[i].style.display = "none";
  }
}

//에깊 기본 정렬
function sort_egogift() {
  const egobox = document.getElementById("egobox");
  const filter_div = Array.from(egobox.getElementsByClassName("main-ego"));
  filter_div.forEach(div => {
    div.parentNode.style.order = 0;
  });
}

//에깊 역순 정렬
function sort_rev_egogift() {
  const egobox = document.getElementById("egobox");
  const filter_div = Array.from(egobox.getElementsByClassName("main-ego"));
  for (var i = 0; i < filter_div.length; i++) {
      filter_div[i].parentNode.style.order = 0 - i;
  }
}

//에깊 등급별, 키워드별 정렬
function sort_type_egogift() {
  this.remove_blank();
  const egobox = document.getElementById("egobox");
  const filter_div = Array.from(egobox.getElementsByClassName("main-ego"));
  const egolist = document.getElementsByClassName("egolist")[0];

  let setting_grid = localStorage.getItem("grid_set");
  if (!setting_grid) setting_grid = 5;
  setting_grid = parseInt(setting_grid);

  let egogift_count = 1;

  filter_div.forEach(div => {
    const egoclass = Array.from(div.classList);
    const gift_tier = egoclass.find(cls => cls.startsWith("tier"));
    const gift_type = egoclass.find(cls => cls.startsWith("type") || cls.startsWith("none"));
    
    div.parentNode.style.order = gift_type.substring(4) * 100000 + gift_tier.substring(4) * 10000 + egogift_count;
    egogift_count++;

    const sameGroup = filter_div.filter(ego => {
      const classes = Array.from(ego.classList);
      return classes.includes(gift_tier) && classes.includes(gift_type);
    });

    const isLast = sameGroup.length > 0 &&
      sameGroup[sameGroup.length - 1].classList[0] === div.classList[0];

    if (isLast) {
      const blank_div = document.createElement("div");
      egolist.appendChild(blank_div);
      blank_div.className = `${gift_tier} ${gift_type} blank`;
      blank_div.style.cssText = `
        display: block;
        grid-column: 1 / ${setting_grid + 1};
        order: ${gift_type.substring(4) * 100000 + gift_tier.substring(4) * 10000};
      `;
    }
  });
}

//가로줄 제거
function remove_blank() {
  const blank = Array.from(document.getElementsByClassName("blank"));
  blank.forEach(el => {
    el.remove();
  })
}