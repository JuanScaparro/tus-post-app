import { IPost } from './interfaces/ipost.interface';
import { JPH_URL } from './utils/api';
import './style.css'


let postsData: IPost[] = [];

const appElement: HTMLElement = <HTMLElement>document.getElementById( 'app' );



const loadData = async () => {
  const url: string = `${ JPH_URL.base }${ JPH_URL.posts }`;

  try {
    const resp = await fetch( url );
    const data = await resp.json();
    saveData( data );
  } catch {

  }
};

const saveData = ( data: IPost[] ) => {
  postsData = data;
  postsData.forEach( post => buildPostCard( post ) );
};

const buildPostCard = ( post: IPost ) => {
  const { userId, id, title, body } = post;

  const template: string = `<div class="card text-center border-info mb-4">
                              <div class="card-header">
                                Id usuario: ${ userId }
                              </div>
                              <div class="card-body">
                                <h5 class="card-title">${ title }</h5>
                                <p class="card-text">${ body }</p>

                                <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Ver Usuario</button>

                                <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRightTwo" aria-controls="offcanvasRight">Comentarios</button>
                              </div>
                              <div class="card-footer text-muted">
                                Likes:  -  Post Id: ${ id }
                              </div>
                            </div>

                            <!-- User Info -->
                            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                              <div class="offcanvas-header">
                                <h3 id="offcanvasRightLabel">Usuario</h3>
                                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                              </div>
                              <div class="offcanvas-body">
                                <div class="card text-center border-info">
                                  <div class="card-header">
                                    Featured
                                  </div>
                                  <div class="card-body">
                                    <h5 class="card-title">Special title treatment</h5>
                                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                  </div>
                                  <div class="card-footer text-muted">
                                    2 days ago
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Post Comments -->
                            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRightTwo" aria-labelledby="offcanvasRightLabel">
                              <div class="offcanvas-header">
                                <h3 id="offcanvasRightLabel">Comentarios</h3>
                                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                              </div>
                              <div class="offcanvas-body">
                                <div class="card text-center border-info">
                                  <div class="card-header">
                                    Featured
                                  </div>
                                  <div class="card-body">
                                    <h5 class="card-title">Special title treatment</h5>
                                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                  </div>
                                  <div class="card-footer text-muted">
                                    2 days ago
                                  </div>
                                </div>
                              </div>
                            </div>`;
  const div = document.createElement( 'div' );
  div.innerHTML = template;
  appElement.appendChild( div );
}

const init = () => {
  loadData();
};

init();