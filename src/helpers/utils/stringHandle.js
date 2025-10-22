export function stringToSlug(str) {
  // remove accents
  var from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    // eslint-disable-next-line
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");

  return str;
}
export function removeVietnamese(str) {
  if (!str || typeof str != typeof "") return str;
  // Bảng chữ cái tiếng Việt có dấu
  const vietnameseWithDiacritics =
    "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ";

  // Bảng chữ cái tiếng Việt không dấu
  const vietnameseWithoutDiacritics =
    "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy";

  // Loại bỏ dấu và chuyển thành chữ thường
  const removedDiacritics = str
    .toLowerCase()
    .replace(
      new RegExp("[" + vietnameseWithDiacritics + "]", "g"),
      function (match) {
        return vietnameseWithoutDiacritics.charAt(
          vietnameseWithDiacritics.indexOf(match)
        );
      }
    );

  return removedDiacritics;
}

export function removeExtraSpaces(str) {
  if (!str || typeof str != typeof "") return str;
  return str.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
}

export const base64Encode = (str) => {
  // For browser environments
  if (typeof window !== "undefined") {
    // Convert string to UTF-8 array and then to base64
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  // For Node.js environments (if your app runs SSR)
  else if (typeof Buffer !== "undefined") {
    return encodeURIComponent(Buffer.from(str).toString("base64"));
  }
  // Fallback (less ideal)
  return btoa(unescape(encodeURIComponent(str)));
};
