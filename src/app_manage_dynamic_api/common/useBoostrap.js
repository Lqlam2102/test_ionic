import { Offcanvas } from "bootstrap";

const getOffcanvas = (id_offcanvas) => {
  const element = document.getElementById(id_offcanvas);

  // Kiểm tra nếu đã có một instance
  let offcanvas = Offcanvas.getInstance(element);

  // Nếu chưa có, tạo mới
  if (!offcanvas) {
    offcanvas = new Offcanvas(element);
  }

  return offcanvas;
};

export { getOffcanvas };
