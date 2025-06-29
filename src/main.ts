import "./style.css";
import DragAndDrop from "./app/drag-and-drop";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <main class="container">
      <section class="puzzle-wrapper">
        <div class="draggables"></div>
        <div class="puzzle" role="group" aria-label="Puzzle drop zone"></div>
        <aside class="model-image">
          <div class="upload-image">
            <div class="image-btns">
              <button class="btn image-btn random-img-btn">random image</button>
              <label for="file-input" class="btn image-btn">upload image</label>
            </div>
            <input type="file" id="file-input" accept="image/*" />
          </div>
        </aside>
      </section>
      <div
        class="modal"
        role="dialog"
        aria-label="modal-heading"
        aria-hidden="true"
      >
        <div class="modal-content">
          <h2 class="modal-heading">game over!</h2>
          <h3 class="modal-text">
            you won with <span class="attempts"> 0 </span> incorrect attempts
          </h3>
          <button class="btn modal-btn">play again</button>
        </div>
      </div>
      <div class="loader">
        <img src="loader3.gif" alt="loading animation" loading="lazy" />
      </div>
    </main>
`;

new DragAndDrop();
