const stringToObjectLatLng = function (location, split = ",") {
  let arr = location.split(split);
  return { lat: arr[0].trim(), lng: arr[1].trim() };
};

const arrayToObjectLatLng = function (arr) {
  return { lat: arr[1], lng: arr[0] };
};

const limitText = function (text, maxLength) {
  if (text.length > maxLength) {
    text = text.slice(0, maxLength) + "...";
  }
  return text;
};

const getDifferentArray = function (array1, array2) {
  const result = array1.filter((item) => !array2.some((x) => x.id === item.id));
  if (array2.length === array1.length) return [];
  return result;
};
function debounce(func, delay) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
function parseDate(dateString) {
  const parsedDate = new Date(dateString);

  // Kiểm tra nếu đầu vào không hợp lệ
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  // Thử chuyển đổi nếu định dạng không hợp lệ
  const formats = [
    /\b(\d{2})\/(\d{2})\/(\d{4})\b/, // dd/mm/yyyy
    /\b(\d{4})-(\d{2})-(\d{2})\b/,   // yyyy-mm-dd
    /\b(\d{2})-(\d{2})-(\d{4})\b/,   // dd-mm-yyyy
    /\b(\d{4})\/(\d{2})\/(\d{2})\b/, // yyyy/mm/dd
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      const [, d, m, y] = match;
      return new Date(`${y}-${m}-${d}`);
    }
  }

  return new Date("Invalid Date"); // Trả về một giá trị không hợp lệ nếu không nhận diện được định dạng
}
export {
  stringToObjectLatLng,
  arrayToObjectLatLng,
  limitText,
  debounce,
  getDifferentArray,
  parseDate
};
