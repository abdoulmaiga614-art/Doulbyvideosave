exports.handler = async function(event) {
  const raw = event.queryStringParameters?.url;

  if (!raw) {
    return json(400, { error: "Lien manquant." });
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return json(400, { error: "Adresse invalide." });
  }

  const allowed = [
    "tiktok.com",
    "www.tiktok.com",
    "vm.tiktok.com",
    "vt.tiktok.com",
    "m.tiktok.com"
  ];

  if (!allowed.includes(parsed.hostname)) {
    return json(400, { error: "Lien TikTok invalide." });
  }

  try {
    const response = await fetch(parsed.toString(), {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const finalUrl = new URL(response.url);

    if (
      !finalUrl.hostname.endsWith("tiktok.com") ||
      !/\/video\/\d+/.test(finalUrl.pathname)
    ) {
      return json(422, {
        error: "Impossible de reconnaître ce lien TikTok public."
      });
    }

    return json(200, { url: finalUrl.toString() });
  } catch {
    return json(502, {
      error: "TikTok ne permet pas de résoudre ce lien pour le moment."
    });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
