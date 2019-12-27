const sendAjax = async function sendAjax(url) {
  const res = await fetch(url, {
    credentials: "same-origin",
    method: "POST"
  });
  if (res.ok) {
    let response = await res.json();
    return response.data.data;
  }
  var error = new Error(await res.text());
  error.status = res.status;
  error.statusText = res.statusText;
  throw error;
};
const sendAjaxWithParams = async function sendAjaxWithParams(
  url,
  params,
  signal
) {
  const data = new URLSearchParams();
  data.append("params", JSON.stringify(params));
  const res = await fetch(url, {
    credentials: "same-origin",
    mode: "no-cors",
    method: "POST",
    body: data,
    signal
  });
  if (res.ok) {
    let response = await res.json();
    return response.data.data;
  }
  var error = new Error(await res.text());
  error.status = res.status;
  error.statusText = res.statusText;
  throw error;
};

export { sendAjax, sendAjaxWithParams };
