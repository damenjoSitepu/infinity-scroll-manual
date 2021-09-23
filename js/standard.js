$(document).ready(function () {
    // Saat Refresh, Paksa position halaman ke bagian teratas halaman.
    restorePageBackToTheTop();

    let start = 0;
    let working = false;

    // Menampilkan konten card default saat pertama kali ada
    showDefaultData('../dataRobot.json', 10);

    // Event Scroll Mode
    window.addEventListener('scroll', function () {
        if ($(this).scrollTop() + 1 >= $('.package').height() - $(window).height()) {
            // Set Time Out Untuk load bar animation ( Prototype )
            if (!working) {
                working = true;

                // Ajax
                let xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {

                        // Script Jangan Dimanipulasi Lagi
                        let data = JSON.parse(this.responseText);

                        if (start < data.machina.length) {
                            $(".animations").toggleClass('animation');
                            setTimeout(() => {
                                $(".animations").toggleClass('animation');

                                // Untuk mendapatkan jumlah sisa baris yang masih belum ditampilkan.
                                let checkMoreAdd = (data.machina.length - start) > 10 ? 10 : (data.machina.length - start);
                                // Untuk menjadi indeks awal satuan data yang akan ditampilkan secara berulang.
                                let incrementCond = data.machina.length <= 10 ? data.machina.length : start + checkMoreAdd;

                                // Render content data selanjutnya setelah content default.
                                renderNextUI(data, start, incrementCond);
                                start += checkMoreAdd;

                                setTimeout(function () {
                                    working = false;
                                }, 500);
                            }, 2000);
                        }
                        // Script Jangan Dimanipulasi Lagi

                    }
                }

                xhr.open('GET', '../dataRobot.json');
                xhr.send();
            }
        }
    });


    function restorePageBackToTheTop() {
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        } else {
            window.onbeforeunload = function () {
                window.scrollTo(0, 0);
            }
        }
    }

    function showDefaultData(filePath, defaultShow) {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {

                // Jangan Manipulasi Script Ini
                let myData = this.responseText;
                let realData = JSON.parse(myData);

                renderDefaultUI(realData.machina, defaultShow);

                // Posisi memberitahu jumlah data yang sudah ditampilkan saat ini
                start += realData.machina.length <= defaultShow ? realData.machina.length : defaultShow;
                // Jangan Manipulasi Script Ini

            }
        }

        xhr.open('GET', filePath);
        xhr.send();
    }

    // Render UI Content
    function renderDefaultUI(dataArray, defaultRowShow) {
        let elPackage = document.querySelector('.package');
        let initContent = '';

        incrementCond = dataArray.length <= defaultRowShow ? dataArray.length : defaultRowShow;

        dataArray.forEach((item, i) => {
            if (i < incrementCond) {
                initContent += `
                <div class="card mb-5" style="width: 18rem;">
                <img src="img/${dataArray[i].img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${dataArray[i].title}</h5>
                    <p>${dataArray[i].desc}</p>
                    <a href="#" class="btn btn-primary">Kepoin Saya</a>
                </div>
                </div>
            `;
            }
        });

        elPackage.innerHTML = initContent;
    }

    // Render UI Content Next
    function renderNextUI(dataContent, startPosition, numberNextColumnShow) {
        let initContent = '';

        for (let i = startPosition; i < numberNextColumnShow; i++) {
            initContent += `
                <div class="card mb-5" style="width: 18rem;">
                <img src="img/${dataContent.machina[i].img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${dataContent.machina[i].title}</h5>
                    <p>${dataContent.machina[i].desc}</p>
                    <a href="#" class="btn btn-primary">Kepoin Saya</a>
                </div>
                </div>
            `;
        }

        $(".package").append(initContent);
    }
});





