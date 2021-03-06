import { JPH_URL } from './utils/api';
import { IPost } from './interfaces/ipost.interface';
import './style.css';


let postsData: IPost[] = [];
let currentPage: number = 1;
let quantity: number = 5;
let isLoading: boolean = false;

const appElement: HTMLElement = <HTMLElement>document.getElementById( 'postContent' );
const sideBarElement: HTMLElement = <HTMLElement>document.getElementById( 'sideBarContent' );
const pageLabel: HTMLElement = <HTMLElement>document.getElementById( 'pageLabel' );
const prevPage: HTMLButtonElement = <HTMLButtonElement>document.getElementById( 'prevPage' );
const nextPage: HTMLButtonElement = <HTMLButtonElement>document.getElementById( 'nextPage' );
const spinner: HTMLElement = <HTMLElement>document.getElementById( 'spinner' );
const spinnerSideBar: HTMLElement = <HTMLElement>document.getElementById( 'spinnerSideBar' );



const loadingSpinner = (spinnerEl: HTMLElement, el: HTMLElement) => {
  isLoading = !isLoading;
  spinnerEl.style.display = isLoading ? 'block' : 'none';
};

const loadData = async () => {
  const url: string = `${ JPH_URL.base }${ JPH_URL.posts }`;
  loadingSpinner( spinner, appElement );
  try {
    const resp = await fetch( url );
    const data = await resp.json();
    saveData( data );
  } catch( error: any ) {
    showError();
  } finally {
    loadingSpinner(spinner, appElement);
  };  
};

const loadMoreInfo = ( userId: string, postId: string ) => {
  sideBarElement.innerHTML = '';
  loadingSpinner( spinnerSideBar, sideBarElement );

  const promiseUsers = fetch( `${ JPH_URL.base }${ JPH_URL.users }/${userId}`);
  const promiseComments = fetch( `${ JPH_URL.base }${ JPH_URL.comments }?postId=${postId}`);
  
  Promise.all([ promiseUsers, promiseComments ])

         .then(responses => {

          setTimeout(()=>{
              loadingSpinner( spinnerSideBar, sideBarElement  );
              responses.forEach( 
              ( respAllData, index ) => {
                  respAllData.json()
                  .then( data => {
                    if( index === 0 ){
                      buildUserCard( data );
                    } else {
                      buildCommentCard( data );
                    };
                });
             });
          }, 2000)
        });
};

const showError = () => {
  window.alert( 'Hubo un error! por Favor volv?? a intentarlo.' );
};

const saveData = ( data: IPost[] ) => {
  postsData = data;
  buildPaginationLabel();
};

const buildPaginationLabel = () => {
  let pages = postsData.slice( currentPage*quantity - quantity, currentPage*quantity );
  pageLabel.textContent = `${ currentPage.toString() } / ${ Math.ceil( postsData.length / quantity ) }`;
  pages.forEach( post => buildPostCard( post ) );
};

function buildUserCard( data : any ) {

  const { username, name, email, phone } = data;
  const buttonClose = `
                        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>`;
  appendElement( buttonClose, sideBarElement );

  const userHeader = `<div class="offcanvas-header">
                        <h4 id="offcanvasRightLabel">Usuario</h4>
                      </div>`;
  appendElement( userHeader, sideBarElement );

  const userTemplate = `<div class="offcanvas-body">
                          <div class="card text-center border-info">
                            <div class="card-header">
                              Usuario: ${ username }
                            </div>
                            <div class="card-body">
                              <h5 class="card-title">Nombre: ${ name }</h5>
                              <p class="card-text">Email: ${ email }</br>Telefono: ${ phone }</p>
                            </div>
                          </div>
                        </div>`;
  appendElement( userTemplate, sideBarElement );
};

function buildCommentCard( data: any) {

  const commentHeader = `<div class="offcanvas-header">
                           <h4 id="offcanvasRightLabel">Comentarios</h4>
                         </div>`;
  appendElement( commentHeader, sideBarElement );

  data.forEach(( comment: any ) => {
    const { name, email, body, postId } = comment;

    const commentTemplate = `<div class="offcanvas-body">
                              <div class="card text-center border-info">
                                <div class="card-header">
                                  Post Id: ${ postId } - Nombre: ${ name }
                                </div>
                                <div class="card-body">
                                  <h5 class="card-title"></h5>
                                  <p class="card-text">${ body }</p>
                                  <p class="card-text">Email: ${ email } </p>
                                </div>
                              </div>
                            </div>`;
    appendElement( commentTemplate, sideBarElement );
  })
}

function appendElement( template: string, el: HTMLElement ) {
  const div = document.createElement( 'div' );
  div.innerHTML = template;
  el.appendChild( div );
};

function buildPostCard( post: IPost ) {
  const { userId, id, title, body } = post;

  const postTemplate: string = `<div class="card text-center border-info mb-4">
                              <div class="card-header">
                                Id usuario: ${ userId }
                              </div>
                              <div class="card-body">
                                <h2 class="card-title">${ title }</h2>
                                <p class="card-text">${ body }</p>

                                <button id="bt${ id }" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">M??s Info</button>
                              </div>
                              <div class="card-footer text-muted">
                                Post Id: ${ id }
                              </div>
                            </div>`;
  appendElement( postTemplate, appElement );

  const btMoreInfo: HTMLButtonElement = <HTMLButtonElement>document.getElementById( `bt${ id }` );
  btMoreInfo.addEventListener( 'click', () => { loadMoreInfo( userId.toString(), id.toString() ) } )
};

const prevBtn = () => {
    if( currentPage > 1 ){
      currentPage --;
      resetPage();
      buildPaginationLabel();
    }else{
      window.alert( 'Esta es la primer p??gina' );
    };
};
prevPage.addEventListener( 'click', prevBtn );

const nextBtn = () => {
  if( currentPage < Math.ceil( postsData.length / quantity ) ) {
    currentPage ++;
    resetPage();
    buildPaginationLabel();
  }else{
    window.alert( 'Lo siento! esta es la ??ltima p??gina' );
  };
};
nextPage.addEventListener( 'click', nextBtn );

const resetPage = () => {
  appElement.innerHTML = '';
};

const init = () => {
  loadData();
};

init();