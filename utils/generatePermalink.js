const pool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generatePermalink() {
  var result = "";

  for (var i = 6; i > 0; --i)
    result += pool[Math.floor(Math.random() * pool.length)];

  return result;
}
