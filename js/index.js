document.addEventListener('DOMContentLoaded', () => {

   //Tabs

   const tabs = document.querySelectorAll('.tabheader__item'),
         tabsContent = document.querySelectorAll('.tabcontent'),
         tabsParent = document.querySelector('.tabheader__items');

   function hideTabContent () {                      
      tabsContent.forEach(item => {                         //скрыть все элементы
         item.style.display = "none";
      });

      tabs.forEach(item => {                                //убрать класс эктив у всех
         item.classList.remove('tabheader__item_active');
      });
   }

   function showTabContent (i=0) {                          //добавить класс эктив нужному элементу
      tabsContent[i].style.display = 'block';
      tabs[i].classList.add('tabheader__item_active');
   }

   hideTabContent();                                        
   showTabContent();

   tabsParent.addEventListener('click', function(event) {             //делегирование от tabsParent к tabs по клику
     const target = event.target;
      if(target && target.classList.contains('tabheader__item')) {   //если у эл-тов tabsParent есть класс .tabheader__item
         tabs.forEach((item, i) => {                                 //то перебираем элементы tabs
            if (target == item) {                                    //если эл-т tabs == эл-ту tabsParent
               hideTabContent();                                     //скрываем все, что было
               showTabContent(i);                                    //ставим в эктив нужный элемент
            }
         });
      }
   });

   // Timer

   const deadline = '2021-12-31';                                    //вводим еобходимое нам время
                                                              // endtime в самом конце в вызове!
   function getTimeRemaining(endtime) {                              //функция рассчитывющая сколько осталось до deadline
      const t = Date.parse(endtime) - Date.parse(new Date()),        // total - итог
         days = Math.floor( t/(1000*60*60*24) ),                     //рассчет месяцы, дни, часы, минуты
         seconds = Math.floor( (t/1000) % 60 ),
         minutes = Math.floor( (t/1000/60) % 60 ),
         hours = Math.floor( (t/(1000*60*60) % 24) );

      return {                                                       //возвращается объект со всеми данными
         'total': t,
         'days': days,
         'hours': hours,
         'minutes': minutes,
         'seconds': seconds
      };
   }

   function getZero(num){                                            //проверяем на наличие нулей
      if (num >= 0 && num < 10) { 
         return '0' + num;
      } else {
         return num;
      }
   }

   function setClock(selector, endtime) {                           //само взаимодействие со страницей

      const timer = document.querySelector(selector),               //забираем с html нужные значения по селектору
            days = timer.querySelector("#days"),                     
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);          //обновляем таймер каждую секунду

      updateClock();                                                //вызываем следующую функцию, чтобы при обновлении стр не было задержек

      function updateClock() {
         const t = getTimeRemaining(endtime);                       //вызываем первую функию, идет рассчет

         days.innerHTML = getZero(t.days);                          //вставляем в html код полученные значения
         hours.innerHTML = getZero(t.hours);
         minutes.innerHTML = getZero(t.minutes);
         seconds.innerHTML = getZero(t.seconds);

         if (t.total <= 0) {                                        //при достижении 000 - останавливаем таймер
               clearInterval(timeInterval);
         }
      }
   }

   setClock('.timer', deadline);                                   //вызываем функцию

   
   // Modal

   const modalTrigger = document.querySelectorAll('[data-modal]'),  //забираем с html триггер на открытие
         modal = document.querySelector('.modal');                  //                весь блок с modal
         /* modalCloseBtn = document.querySelector('[data-close]');    //   триггер на закрытие, удалили, ~чтобы работало с любыми крестиками */

   modalTrigger.forEach(btn => {                                    //делаем перебор для триггеров
      btn.addEventListener('click', openModal);                     //при нажатии на кнопку активируем функцию openModal
   });

   function closeModal() {                                          //функция закрыия модального окна
      modal.classList.add('hide');                                  //добавляем класс 'скрыть'
      modal.classList.remove('show');                               //убираем класс 'показать'
      document.body.style.overflow = '';                            //включаем прокрутку
   }

   function openModal() {                                           //функция открытия модального окна
      modal.classList.add('show');                                  //добавляем класс 'показать'
      modal.classList.remove('hide');                               //убираем класс 'скрыть'
      document.body.style.overflow = 'hidden';                      //отключаем прокрутку
      clearInterval(modalTimerId);                                  //отключаем таймер, если пользователь сам открыл окно
   }

   /* modalCloseBtn.addEventListener('click', closeModal);  тож удалили, чтобы везде работало            //при нажатии на кн откл сработате ф-я closeModal */

   modal.addEventListener('click', (e) => {                         //если тыкать на подушку, отключается окно
      if (e.target === modal || e.target.getAttribute('data-close') == '') {                //если эл-т по которому тыкают равер всему блоку modal
         // || e.target.getAttribute('data-close') == '' - чтобы со всеми работало
         closeModal();
      }
   });

   document.addEventListener('keydown', (e) => {                    //по нажатии кнопки 
      if (e.code === "Escape" && modal.classList.contains('show')) { //escape и modal имеет класс show закрыть окно
         closeModal();
      }
   });


   
   const modalTimerId = setTimeout(openModal, 50000);                //включать окно после 3сек после открытия сайта

   function showModalByScroll() {                                   //окрыть окно при доскролле до низа сайта
      if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
         openModal();                                               //если высота скролла+высота окна = всей высоте сайта
         window.removeEventListener('scroll', showModalByScroll);   //при скролле ЗАКРЫТЬ окно, после одного открытия
      }
   }
   window.addEventListener('scroll', showModalByScroll);            //открыть окно, вызов (ссылка) на функцию



   // Используем классы для создание карточек меню

   class MenuCard {                                                 //создаем класс для карточек меню
      constructor(src, alt, title, descr, price, parentSelector, ...classes) {  //создаем конструктор карточек, добавляем rest оператор
         this.src = src;
         this.alt = alt;
         this.title = title;
         this.descr = descr;
         this.price = price;
         this.classes = classes;                                   //для rest оператора
         this.parent = document.querySelector(parentSelector);     //ищем родителя, в которого положим карточки
         this.transfer = 70;                                       //Для конвертации рубля
         this.changeToUAH();                                       //вызываем функцию конвертации
      }

      changeToUAH() {                                               //функция конвертации
         this.price = this.price * this.transfer; 
      }

      render() {                                                    //рендерим новые карточки
         const element = document.createElement('div');             //создаем div и записываем в element
         
         
         if (this.classes.length === 0) {
            this.classes = "menu__item";
            element.classList.add(this.classes);
         } else {
            this.classes.forEach(className => element.classList.add(className));
         }
         element.innerHTML = `                                     
            <div class="menu__item">
               <img src=${this.src} alt=${this.alt}>
               <h3 class="menu__item-subtitle">${this.title}</h3>
               <div class="menu__item-descr">${this.descr}</div>
               <div class="menu__item-divider"></div>
               <div class="menu__item-price">
                     <div class="menu__item-cost">Цена:</div>
                     <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
               </div>
            </div>
         `;                                                        //передаем структуру из HTML, там удаляем
         this.parent.append(element);                              //добавляем в родит элемент это (делегирование)
      }
   }

   //карточки с сервера  GET
   const getResource = async (url) => {    
      const res = await fetch(url);

      if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`); //получение ошибки статус и юрл
      }
      return await res.json();
   };

   getResource('http://localhost:3000/menu')
      .then(data => {
         data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
         });
      });
   

      //карточки с сервера, другой вар, попроще
      // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }

  /* //продолжение карточки без сервера
  new MenuCard(                                                     //вызываем наш класс с методом рендер
      "img/tabs/vegy.jpg",
      "vegy",
      'Меню "Фитнес"',
      'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
      9,
      ".menu .container"
  ).render();

  new MenuCard(
      "img/tabs/post.jpg",
      "post",
      'Меню "Постное"',
      'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
      14,
      ".menu .container"
  ).render();

  new MenuCard(
      "img/tabs/elite.jpg",
      "elite",
      'Меню “Премиум”',
      'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
      21,
      ".menu .container"
  ).render();                                                       //все, получаем карточки без html */


   //Forms - отправка и получение данных с сервера

   const forms = document.querySelectorAll('form');

   const message = {                                 //сообщения для выведения пользователю о статусе
      loading: 'img/form/spinner.svg',             //картинка вместо загрузка...
      sucsess: 'Спасибо! Скоро мы с вами свяжемся',
      failure: 'Что-то пошло не так...',
   }

   forms.forEach(item => {                          //под ф-ии подвязать форму bindData
      bindData(item);
   });




   /* function postData(form) {                      //функция отправки данных
      form.addEventListener('submit', (e) => {       //при отправке формы
         e.preventDefault();                         //отключение стандартного поведения

         let statusMessege = document.createElement('img'); //создание дива для сообщений message или img для картинки
         // statusMessege.classList.add('status'); //до 


         statusMessege.src = message.loading;       //после
         // statusMessege.textContent = message.loading;   // до
         statusMessege.style.cssText = `
            display: block;
            margin: 0 auto;
            margin-top: 15px;
         `;                                          //можно в css добавить стили, а здесь просто добавлять класс
         // form.appendChild(statusMessege);                 //выведение сообщения  
         form.insertAdjacentElement('afterend', statusMessege);



         const request = new XMLHttpRequest();       //запрос на сервер, 
         request.open('POST', 'server.php');         //указание пути
         
         // то, что ниже - для передачи файла (formData), но ломает код!
         // // request.setRequestHeader('Content-type', 'multipart/form-data');  
         //const formData = new FormData(form); 


         
         request.setRequestHeader('Content-type', 'application/json');   //а вот для JSON нужен
         const formData = new FormData(form);  

         const object = {};                        //для переведения в JSON
         formData.forEach(function(value, key){
            object[key] = value;
         });

         const json = JSON.stringify(object);

         //если formData
         // request.send(formData);                     //отправка запроса 

         request.send(json);                        //отправка запроса json


         request.addEventListener('load', () => {    //обр. событ для отправки запроса
            if (request.status === 200) {
               console.log(request.response);
               // // statusMessege.textContent = message.sucsess;  //сообщение, когда все готово   
               showThanksModal(message.sucsess);             //создали ф-ю в след шаге - сообщение, когда все готово
               form.reset();                                 //очистить форму
               // // setTimeout(() => {
               // //   statusMessege.remove();                   //убрать сообщение
               // // }, 2000);   в след пункте убираем таймаут//
               statusMessege.remove();                        //убрать сообщение
            }  else {
               // // statusMessege.textContent = message.failure; //если неудачно-сообщение 
               showThanksModal(message.failure);           //создали ф-ю в след шаге - сообщение, если неудачно
            }
         });
      });
   } */

   //json - постим на сервер  POST
   const postData = async (url, data) => {    //исп async/await
      const res = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: data
      });

      return await res.json();
   };



   // переписанная функция postData с помощью API, все пояснения выше
   function bindData(form) {
      form.addEventListener('submit', (e) => {
         e.preventDefault();

         let statusMessage = document.createElement('img');
         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
         `;
         form.insertAdjacentElement('afterend', statusMessage);
   
         const formData = new FormData(form);

         /* const object = {};
         formData.forEach(function(value, key){
            object[key] = value;
         }); */

         const json = JSON.stringify(object.fromEntries(formData.entries()));
         //объект переводим в массивы, потом в объекты, потом делаем их json

         /*  fetch('server.php', {                            // добавляем fetch, используем промисы
               method: 'POST',
               headers: {
                     'Content-Type': 'application/json'
               },
               body: JSON.stringify(object)
          }) */


          postData('http://localhost:3000/requests', json) //переписали fetch функцией, она выше
          //изменили 1 аргумент, вместо server.php - http://localhost:3000/requests
          .then(data => {
              console.log(data);
              showThanksModal(message.success);
              statusMessage.remove();
          }).catch(() => {
              showThanksModal(message.failure);
          }).finally(() => {
              form.reset();
          });
      });
  }


   //~Красивое благодарсвенное окно

   function showThanksModal(message) {                            //показ благодарности в модальном окне
      const prevModalDialog = document.querySelector('.modal__dialog'); //забираем все модальное окно

      prevModalDialog.classList.add('hide');              //Доб класс скрывающий контент модального окна

      openModal();                                       //вызываем ф-ю открытия модального окна
      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');       //переиспользуем классы
      thanksModal.innerHTML =   `                       
         <div class="modal__content">
            <div class="modal__clothe" data-clothe></div>
            <div class="modal__title">${message}</div>
         </div>
      `;                                               //доб новый контент

      document.querySelector('.modal').append(thanksModal); //'заапендить' новое диалоговое окно

      setTimeout(() => {              //чтобы через время это исчезало и появлялось то диалоговое окно
         thanksModal.remove();        //просто удаляем, потом может заново сгенерироваться
         prevModalDialog.classList.add('show');  //для высвеч того окна
         prevModalDialog.classList.remove('hide');
         closeModal();               //чтобы не мешало, просто закрываем

      }, 4000)

   }

   fetch('http://localhost:3000/menu')
      .then(data => data.json())
      .then(res => console.log(res));
   


   /* //Slider вариант #1
   const slides = document.querySelectorAll('.offer__slide'),   //забираем слайды
         prev = document.querySelector('.offer__slider-prev'),  //стрелка предыдущий
         next = document.querySelector('.offer__slider-next'),  //стрелка следующий
         total = document.querySelector('#total'), //номер след
         current = document.querySelector('#current'); //номер этого слайда
   let slideIndex = 1; //проверка индекса слайда

   showSlides(slideIndex);              //чтобы изначально показывало

   if (slides.length < 10) {                    //номер последнего слайда
      total.textContent = `0${slides.length}`;
   } else {
      total.textContent = slides.length;
   }


   function showSlides(n) {            //показ слайдов
      if (n > slides.length) {         //если №слайда больше кол-ва слайдов, опять 1
         slideIndex = 1;
      }

      if (n < 1) {                     //если №слайда меньше 1 - № последнего слайда
         slideIndex = slides.length;
      }

      slides.forEach(item => item.style.display = 'none');  //пока скрываем все слайды

      slides[slideIndex - 1].style.display = 'block';       //показываем только нужный нам

      if (slides.length < 10) {                            //номер текущего слайда
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   }

   function plusSlides(n) {                                //+1 к n после верхней функции, которая здесь же вызывется
      showSlides(slideIndex += n);
   }

   prev.addEventListener('click', () => {                  //обр событий на кнопочки
      plusSlides(-1);
   });

   next.addEventListener('click', () => {
      plusSlides(1);
   }); */

   // Slider вариант #2 (№62)
              //доп в html слайдер оборачиваем в див
   let offset = 0;     //отступ вправо-лево с пом трансформ
   let slideIndex = 1;

   const slides = document.querySelectorAll('.offer__slide'), //описание выше
         slider = document.querySelector('.offer__slider'),   //весь слайдер
         prev = document.querySelector('.offer__slider-prev'),
         next = document.querySelector('.offer__slider-next'),
         total = document.querySelector('#total'),
         current = document.querySelector('#current'),
         slidesWrapper = document.querySelector('.offer__slider-wrapper'), //обертка
         width = window.getComputedStyle(slidesWrapper).width, //ширина обертки - забираем с css
         slidesField = document.querySelector('.offer__slider-inner'); //внутри обертки див

   if (slides.length < 10) {                   //описание выше
       total.textContent = `0${slides.length}`;
       current.textContent =  `0${slideIndex}`;
   } else {
       total.textContent = slides.length;
       current.textContent =  slideIndex;
   }
   
   slidesField.style.width = 100 * slides.length + '%'; //ширину задаем равную 100*кол-во слайдов в %
   slidesField.style.display = 'flex';          //чтобы высроились слайды в шнрнгу
   slidesField.style.transition = '0.5s all';   //плавное передвижение

   slidesWrapper.style.overflow = 'hidden';     //скрываем элементы не попадающие в область видимости

   slides.forEach(slide => {
       slide.style.width = width; //устанавливаем одинаков ширину для всех слайдов
   });


   //навигация
   slider.style.position = 'relative'; //чтобы абсолютно позиционировать

    const indicators = document.createElement('ol'),  //создаем список
          dots = [];         //создаем массив
    indicators.classList.add('carousel-indicators');  //добавляем класс
    indicators.style.cssText = `  
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `; // Если хотите - добавьте в стили, но иногда у нас нет доступа к стилям
    slider.append(indicators);    //помещаем обертку в слайдер

    for (let i = 0; i < slides.length; i++) {       //создаем нужное кол-во точек
        const dot = document.createElement('li');  //создаем элемент списка
        dot.setAttribute('data-slide-to', i + 1);  //опр атрибут для указания №
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;  //доб стили
        if (i == 0) {            //если активный эл-т меняем опасити, в 2р больше
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);  //добавляем значения, были активными
    }

   function deliteNotDigits(str) {
      return +str.replace(/\D/g, '');
   }

   next.addEventListener('click', () => {
      /*if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {
         offset = 0;          //если дошли до конца, возвр в начало */
      if (offset == deliteNotDigits(width) * (slides.length - 1)) { //исп регулярные выражения, чуть выше в функции описано
         offset = 0;   
      } else {
         offset += deliteNotDigits(width); //если нет смещаемся дальше
      }

      slidesField.style.transform = `translateX(-${offset}px)`; //для сдвига в лево в пх

      if (slideIndex == slides.length) {      //для номера слайда
         slideIndex = 1;                    //до конца-перейти на 1
      } else {
         slideIndex++;                      //не последнй - +1
      }

      if (slides.length < 10) {      //опять проверяем на нужность 0
         current.textContent =  `0${slideIndex}`;  
      } else {
         current.textContent =  slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = ".5"); //изначально опасити 0,5
      dots[slideIndex-1].style.opacity = 1;          //активна - опасити 1
   });

   prev.addEventListener('click', () => {  //для сдвига в право
      if (offset == 0) {                  //если первый слайд
         /* offset = +width.slice(0, width.length - 2) * (slides.length - 1); //смещ к последнему */
         offset = deliteNotDigits(width) * (slides.length - 1);
      } else {
         offset -= deliteNotDigits(width); //иначе на 1 сл назад
      }

      slidesField.style.transform = `translateX(-${offset}px)`;//для сдвига
      
      
      if (slideIndex == 1) {//как и в next все

         slideIndex = slides.length;
      } else {
         slideIndex--;
      }

      if (slides.length < 10) {
         current.textContent =  `0${slideIndex}`;
      } else {
         current.textContent =  slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = ".5");  //как для next
      dots[slideIndex-1].style.opacity = 1;
   });

   dots.forEach(dot => {        //чтобы при клике на точку-переходить на нее
      dot.addEventListener('click', (e) => {   //при клике на точку
          const slideTo = e.target.getAttribute('data-slide-to'); //тот самый атрибут

          slideIndex = slideTo;     //индекс равен выбранной точке
          offset = deliteNotDigits(width) * (slideTo - 1); //запис ширину

          slidesField.style.transform = `translateX(-${offset}px)`;  //запис перемещение

          if (slides.length < 10) {                    //проверяем на 0
              current.textContent =  `0${slideIndex}`;
          } else {
              current.textContent =  slideIndex;
          }

          dots.forEach(dot => dot.style.opacity = ".5");
          dots[slideIndex-1].style.opacity = 1;
      });
  });
   
  // Calculator

   const result = document.querySelector('.calculating__result span'); //для записи результата
   let sex, height, weight, age, ratio;  
   
   if (localStorage.getItem('sex')) {        //если указали пол
      sex = localStorage.getItem('sex');     //записываем его в локалСторедж
   } else {                                  //если не записали
      sex = 'female';                        //сами указываем
      localStorage.setItem('sex', 'female'); //и записываем в локалСторедж
   }

   if (localStorage.getItem('ratio')) {        
      ratio = localStorage.getItem('ratio');     
   } else {                                  
      ratio = '1.375';                        
      localStorage.setItem('ratio', '1.375'); 
   }

   function initLocalSettings(selector, activeClass) {  //для записи в локалсторедж
      const elements = document.querySelectorAll(selector); //забираем элем по селектору

      elements.forEach(elem => {
         elem.classList.remove(activeClass);  //убрать классы акт у элементов
         if (elem.getAttribute('id') === localStorage.getItem('sex')) { //если id совпадает 
            elem.classList.add(activeClass); //добавляем класс акт
         }
         if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {  //если совпадает data атрибут
            elem.classList.add(activeClass); //добавляем класс актив
         }
      });
   }

   initLocalSettings('#gender', 'calculating__choose-item_active');
   initLocalSettings('.calculating__choose_big', 'calculating__choose-item_active');

   function calcTotal() {              //подсчет конечного результата
      if (!sex || !height || !weight || !age || !ratio) {   //если не ввели какие-то данные
            result.textContent = '____'; 
            return;
      }
      if (sex === 'female') {  //если женщины
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);   //используем формулу для рассчета используя полученные данные
            //math - для округления до целого значения
      } else {   //если мужчины
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
      }
   }

   calcTotal(); //вызываем формулу

   function getStaticInformation(selector, activeClass) { //сбор статичных данных, переключатели кнопочек
         const elements = document.querySelectorAll(selector); //получаем в родителе все дивы (делегирование событий)

         elements.forEach(elem => {           //перебираем элементы
            elem.addEventListener('click', (e) => {     //при клике
               if (e.target.getAttribute('data-ratio')) {  //если содержит атрибут
                     ratio = +e.target.getAttribute('data-ratio'); //присваеваем
                     localStorage('ratio', +e.target.getAttribute('data-ratio'));  //запоминаем, что вводили
               } else {     //иначе
                     sex = e.target.getAttribute('id');  //присваеваем
                     localStorage('sex', e.target.getAttribute('id'));
               }
   
               elements.forEach(elem => {
                     elem.classList.remove(activeClass);  //сначала убираем у всех класс эктив
               });
   
               e.target.classList.add(activeClass);  //добавляем класс кликнутому элементу
   
               calcTotal();  //еще раз вызываем 1 функцию
            });
         });
   }

   getStaticInformation('#gender', 'calculating__choose-item_active'); //вызов для пола
   getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');  //вызов для активности

   function getDynamicInformation(selector) {        //для динамических элементов
         const input = document.querySelector(selector);  //забираем опредленный элемент

         input.addEventListener('input', () => {       //при инпуте (вводе)
            
            if (input.value.match(/\D/g)) {           //если не цифра
               input.style.border = 'solid red';      //красная рамка
            } else if (input.value.match(/\d/g)) {    //все правильно-зеленый
               input.style.border = 'solid green';
            } else {                                  //ничего-ничего
               input.style.border = 'none';
            }
            
            
            
            switch(input.getAttribute('id')) {  //смотрим чем является данные по id
               case "height":                    //если рост
                     height = +input.value;      //записываем введеные пользователем данные
                     break;
               case "weight":
                     weight = +input.value;
                     break;
               case "age":
                     age = +input.value;
                     break;
            }

            calcTotal(); //вызываем несколько раз, чтобы проссчитался, когда будут введены все данные
         });
   }

   getDynamicInformation('#height');   // выводим для разных селекторов
   getDynamicInformation('#weight');
   getDynamicInformation('#age');






});