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
         modal = document.querySelector('.modal'),                  //                весь блок с modal
         modalCloseBtn = document.querySelector('[data-close]');    //                триггер на закрытие

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

   modalCloseBtn.addEventListener('click', closeModal);             //при нажатии на кн откл сработате ф-я closeModal

   modal.addEventListener('click', (e) => {                         //если тыкать на подушку, отключается окно
      if (e.target === modal) {                                     //если эл-т по которому тыкают равер всему блоку modal
         closeModal();
      }
   });

   document.addEventListener('keydown', (e) => {                    //по нажатии кнопки 
      if (e.code === "Escape" && modal.classList.contains('show')) { //escape и modal имеет класс show закрыть окно
         closeModal();
      }
   });


   //закомментировали, чтобы не мешало
   //const modalTimerId = setTimeout(openModal, 3000);                //включать окно после 3сек после открытия сайта

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
  ).render();                                                       //все, получаем карточки без html


   //Forms - отправка и получение данных с сервера

   const forms = document.querySelectorAll('form');

   const message = {                                 //сообщения для выведения пользователю о статусе
      loading: 'Загрузка...',
      sucsess: 'Спасибо! Скоро мы с вами свяжемся',
      failure: 'Что-то пошло не так...',
   }

   forms.forEach(item => {                          //под ф-ии подвязать форму postData
      postData(item);
   });




   function postData(form) {
      form.addEventListener('submit', (e) => {       //при отправке формы
         e.preventDefault();                         //отключение стандартного поведения

         let statusMessege = document.createElement('div'); //создание дива для сообщений message
         statusMessege.classList.add('status');
         statusMessege.textContent = message.loading;
         form.appendChild(statusMessege);                 //выведение сообщения 

         const request = new XMLHttpRequest();       //запрос на сервер, 
         request.open('POST', 'server.php');         //указание пути
         
         /* //то, что ниже - для передачи файла (formData), но ломает код!
         // request.setRequestHeader('Content-type', 'multipart/form-data');  
         const formData = new FormData(form); */


         //а вот для JSON нужен
         request.setRequestHeader('Content-type', 'application/json');
         const formData = new FormData(form);  

         const object = {};                        //для переведения в JSON
         formData.forEach(function(value, key){
            object[key] = value;
         });

         const json = JSON.stringify(object);

         //если formData
         /* request.send(formData);                     //отправка запроса */

         request.send(json);                        //отправка запроса


         request.addEventListener('load', () => {    //обр. событ для отправки запроса
            if (request.status === 200) {
               console.log(request.response);
               statusMessege.textContent = message.sucsess;  //сообщение, когда все готово  
               form.reset();                                 //очистить форму
               setTimeout(() => {
                  statusMessege.remove();                   //убрать сообщение
               }, 2000);
            }  else {
               statusMessege.textContent = message.failure; //если неудачно-сообщение
            }
         });
      });
   }









   
});