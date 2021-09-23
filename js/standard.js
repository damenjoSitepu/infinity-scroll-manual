$(document).ready(function () {
    // Saat Refresh, Paksa position halaman ke bagian teratas halaman.
    restorePageBackToTheTop();

    // konstanta file path atau url
    const FILE_PATH = '../dataRobot.json'

    let start = 0;
    let working = false;

    // Menampilkan konten card default saat pertama kali ada
    showDefaultData(FILE_PATH, 5);

    // Event Scroll Mode
    window.addEventListener('scroll', function () {
        if ($(this).scrollTop() + 1 >= $('.package').height() - $(window).height()) {
            // Set Time Out Untuk load bar animation ( Prototype )
            if (!working) {
                working = true;

                // Ajax
                fetch(FILE_PATH)
                    .then(errorGuard)
                    .then(response => displayDataMachina(response, 5))
                    .catch(error => console.log(error))
            }
        }
    });


    // ini logicnya jo jgn di otak otik
    function displayDataMachina(data, rowDefault = 10) {
        if (start < data.machina.length) {
            $(".animations").toggleClass('animation');
            setTimeout(() => {
                $(".animations").toggleClass('animation');

                // Untuk mendapatkan jumlah sisa baris yang masih belum ditampilkan.
                let checkMoreAdd = (data.machina.length - start) > rowDefault ? rowDefault : (data.machina.length - start);
                // Untuk menjadi indeks awal satuan data yang akan ditampilkan secara berulang.
                let incrementCond = data.machina.length <= rowDefault ? data.machina.length : start + checkMoreAdd;

                // Render content data selanjutnya setelah content default.
                renderNextUI(data, start, incrementCond);
                start += checkMoreAdd;

                setTimeout(function () {
                    working = false;
                }, 500);
            }, 2000);
        }
    }

    // ini pelindung dari error "json is not a function bla... bla.. bla..."
    function errorGuard(resp) {
        if (resp.status != 200) throw new Error(resp.status)

        return resp.json()
    }


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
        fetch(filePath)
            .then(errorGuard)
            .then(realData => {
                // render UI uhuyyyy
                renderDefaultUI(realData.machina, defaultShow);

                // Posisi memberitahu jumlah data yang sudah ditampilkan saat ini
                start += realData.machina.length <= defaultShow ? realData.machina.length : defaultShow;

            })
            .catch(error => console.log(error))
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






