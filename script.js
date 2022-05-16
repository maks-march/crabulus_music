;((D, B, log = arg => console.log(arg)) => {
    // это позволит обращаться к document и document.body как к D и B, соответственно
    // log = arg => console.log(arg) - здесь мы используем параметры по умолчанию
    // это позволит вызывать console.log как log
    //Первым делом объявляем переменные для файлоприемника, инпута и файла 
    const dropZone = D.querySelector('div')
    const input = D.querySelector('input')
    let file
    //Отключаем обработку событий «dragover» и «drop» браузером
    D.addEventListener('dragover', ev => ev.preventDefault())
    D.addEventListener('drop', ev => ev.preventDefault())

    dropZone.addEventListener('drop', ev => {
        // отключаем поведение по умолчанию
        ev.preventDefault()
        // смотрим на то, что получаем
        //log(ev.dataTransfer)
        // получаем следующее (в случае передачи изображения)
        /*
        DataTransfer {dropEffect: "none", effectAllowed: "all", items: DataTransferItemList, types: Array(1), files: FileList}
            dropEffect: "none"
            effectAllowed: "all"
        =>  files: FileList
                length: 0
            __proto__: FileList
            items: DataTransferItemList {length: 0}
            types: []
            __proto__: DataTransfer
        */
        // интересующий нас объект (File) хранится в свойстве "files" объекта "DataTransfer"
        // извлекаем его
        file = ev.dataTransfer.files[0]
        // проверяем
        //log(file)
        /*
        File {name: "image.png", lastModified: 1593246425244, lastModifiedDate: Sat Jun 27 2020 13:27:05 GMT+0500 (Екатеринбург, стандартное время), webkitRelativePath: "", size: 208474, …}
            lastModified: 1593246425244
            lastModifiedDate: Sat Jun 27 2020 13:27:05 GMT+0500 (Екатеринбург, стандартное время) {}
            name: "image.png"
            size: 208474
            type: "image/png"
            webkitRelativePath: ""
            __proto__: File
        */
        // передаем файл в функцию для дальнейшей обработки
        handleFile(file)
        //Мы только что реализовали простейший механизм «dran'n'drop».
    })
    //Обрабатываем клик по файлоприемнику
    dropZone.addEventListener('click', () => {
        // кликаем по скрытому инпуту
        input.click()
    
        // обрабатываем изменение инпута
        input.addEventListener('change', () => {
            // смотрим на то, что получаем
            //log(input.files) 
            // получаем следующее (в случае передачи изображения)
            /*
            FileList {0: File, length: 1}
            =>  0: File
                    lastModified: 1593246425244
                    lastModifiedDate: Sat Jun 27 2020 13:27:05 GMT+0500 (Екатеринбург, стандартное время) {}
                    name: "image.png"
                    size: 208474
                    type: "image/png"
                    webkitRelativePath: ""
                    __proto__: File
                length: 1
                __proto__: FileList
            */   
            // извлекаем File
            file = input.files[0]
            // проверяем
            //log(file)
            // передаем файл в функцию для дальнейшей обработки
            handleFile(file)
        })
    })
    const handleFile = file => {
        dropZone.remove()
        input.remove()
        //Способ обработки файла зависит от его типа:
        //log(file.type)
        // в случае изображения
        // image/png
        //Мы не будем работать с html, css и js-файлами, поэтому запрещаем их обработку:
        if (file.type === 'text/html' ||
            file.type === 'text/css' ||
            file.type === 'text/javascript')
        return;
        if (file.type === 'application/pdf') {
            createIframe(file)
            return;
        }
        // нас интересует то, что находится до слеша
        const type = file.type.replace(/\/.+/, '')
        // проверяем
        //log(type)
        // в случае изображения
        // image
        const createAudio = audio => {
            // создаем элемент "audio"
            const audioEl = D.createElement('audio')
            // добавляем панель управления
            audioEl.setAttribute('controls', '')
            //привязываем элемент к полученному файлу
            B.append(audioEl)
            audioEl.src = URL.createObjectURL(audio)
            // запускаем воспроизведение
            //audioEl.play()
            URL.revokeObjectURL(audio)
        }
        switch (type) {
            // если аудио
            case 'audio':
                createAudio(file)
                break;
            
            // иначе, выводим сообщение о неизвестном формате файла,
            // и через две секунды перезагружаем страницу
            default:
                B.innerHTML = `<h3>Unknown File Format!</h3>`
                const timer = setTimeout(() => {
                    location.reload()
                    clearTimeout(timer)
                }, 2000)
                break;
        }
        
    }

})(document, document.body)