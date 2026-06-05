// delete-short-articles.mjs
import { Client } from "ssh2";
const c = new Client();

c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S psql "postgresql://postgres:postgres@localhost:5432/promptopia" -c "
    DELETE FROM \\"Case\\" WHERE slug IN (
      'ai-siweidaotu','ai-xiezhen-xiutu','ai-xie-xiaoshuo','ai-dianshang-zhutu',
      'ai-zhengli-huiyi','ai-qiming','ai-xue-yingyu','ai-shuju-fenxi',
      'ai-hetong','ai-lvyou-gonglve','ai-dushu-biji','ai-fengmian-sheji',
      'ai-gongzuo-zongjie'
    );
  "`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log("Deleted short articles"); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
