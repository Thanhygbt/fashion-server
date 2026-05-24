const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../fe/img');
const sqlFile = path.join(__dirname, 'setup.sql');

const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

const vMap = {
    'ao-hoodie-co-khoa-mau-xam': 'Áo hoodie có khóa màu xám',
    'ao-hoodie-mau-en': 'Áo hoodie màu đen',
    'ao-khoac-mau-en': 'Áo khoác màu đen',
    'ao-khoac-ni-mau-en': 'Áo khoác nỉ màu đen',
    'ao-phong-dang-hop-mau-nau': 'Áo phông dáng hộp màu nâu',
    'ao-phong-mau-nau': 'Áo phông màu nâu',
    'ao-polo-dai-tay-mau-hong': 'Áo polo dài tay màu hồng',
    'ao-polo-dai-tay-mau-xam': 'Áo polo dài tay màu xám',
    'ao-polo-in-hinh-mau-en': 'Áo polo in hình màu đen',
    'ao-polo-mau-en': 'Áo polo màu đen',
    'ao-polo-mau-trang': 'Áo polo màu trắng',
    'ao-polo-mau-xam': 'Áo polo màu xám',
    'ao-polo-mau-xanh': 'Áo polo màu xanh',
    'ao-so-mi-dai-tay-mau-be': 'Áo sơ mi dài tay màu be',
    'ao-so-mi-dai-tay-mau-en': 'Áo sơ mi dài tay màu đen',
    'ao-so-mi-dai-tay-mau-xanh': 'Áo sơ mi dài tay màu xanh',
    'ao-so-mi-ke-soc-mau-xam': 'Áo sơ mi kẻ sọc màu xám',
    'ao-so-mi-mau-be': 'Áo sơ mi màu be',
    'ao-so-mi-mau-en': 'Áo sơ mi màu đen',
    'ao-so-mi-mau-o-ruou': 'Áo sơ mi màu đỏ rượu',
    'ao-so-mi-mau-trang': 'Áo sơ mi màu trắng',
    'ao-so-mi-mau-xanh': 'Áo sơ mi màu xanh',
    'ao-thun-dang-hop-mau-t-en': 'Áo thun dáng hộp màu đen',
    'ao-thun-dang-hop-mau-trang': 'Áo thun dáng hộp màu trắng',
    'ao-thun-in-hinh-mau-en': 'Áo thun in hình màu đen',
    'ao-thun-in-hinh-mau-xanh': 'Áo thun in hình màu xanh',
    'ao-thun-ke-soc-mau-en': 'Áo thun kẻ sọc màu đen',
    'ao-thun-mau-o': 'Áo thun màu đỏ',
    'giay-the-thao-mau-en': 'Giày thể thao màu đen',
    'khan-choang-co-mau-en': 'Khăn choàng cổ màu đen',
    'mu-coi-mau-be': 'Mũ cói màu be',
    'mu-eo-cheo-mau-o': 'Mũ đeo chéo màu đỏ',
    'mu-len-mau-en': 'Mũ len màu đen',
    'mu-len-mau-xam': 'Mũ len màu xám',
    'mu-luoi-trai-mau-xanh-am': 'Mũ lưỡi trai màu xanh dương',
    'quan-dai-ke-soc-mau-trang': 'Quần dài kẻ sọc màu trắng',
    'quan-jean-mau-en': 'Quần jean màu đen',
    'quan-jean-mau-xam': 'Quần jean màu xám',
    'quan-jogger-mau-xam': 'Quần jogger màu xám',
    'quan-kaki-dai-mau-be': 'Quần kaki dài màu be',
    'quan-ni-dai-mau-en': 'Quần nỉ dài màu đen',
    'quan-short-jean-mau-en': 'Quần short jean màu đen',
    'quan-short-jean-mau-xanh': 'Quần short jean màu xanh',
    'quan-short-mau-hong': 'Quần short màu hồng',
    'quan-short-mau-nau': 'Quần short màu nâu',
    'quan-short-mau-xam': 'Quần short màu xám',
    'quan-short-mau-xanh': 'Quần short màu xanh',
    'quan-short-ni-mau-xam': 'Quần short nỉ màu xám',
    'quan-thun-dai-mau-en': 'Quần thun dài màu đen',
    'quan-tui-hop-mau-en': 'Quần túi hộp màu đen',
    'quan-tui-hop-mau-nau': 'Quần túi hộp màu nâu',
    'that-lung-vai-mau-en': 'Thắt lưng vải màu đen',
    'tui-du-eo-cheo-mau-en': 'Túi dù đeo chéo màu đen',
    'tui-eo-cheo-mau-en': 'Túi đeo chéo màu đen'
};

let values = files.map(filename => {
    let key = filename.replace(/\.(png|jpe?g)$/i, '').replace(/-png$/, '');
    let niceName = vMap[key];
    
    // fallback if not mapped
    if (!niceName) {
        niceName = key.replace(/-/g, ' ');
        niceName = niceName.charAt(0).toUpperCase() + niceName.slice(1);
    }
    
    let category = 1; // Default
    if (niceName.toLowerCase().includes('quần')) category = 2; // Quan
    else if (niceName.toLowerCase().includes('khoác')) category = 3; // Ao Khoac
    else if (niceName.toLowerCase().includes('mũ') || niceName.toLowerCase().includes('túi') || niceName.toLowerCase().includes('giày') || niceName.toLowerCase().includes('khăn') || niceName.toLowerCase().includes('thắt lưng')) category = 4; // Phu Kien
    
    return `('${niceName}', 'Sản phẩm ${niceName} chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/${filename}', ${category}, 100)`;
});

const sqlInsert = `INSERT INTO products (name, description, price, image_url, category_id, stock_quantity) VALUES\n` + values.join(',\n') + ';';

let sqlContent = fs.readFileSync(sqlFile, 'utf8');
const regex = /INSERT INTO products \(name, description, price, image_url, category_id, stock_quantity\) VALUES[\s\S]*?;/;

if (regex.test(sqlContent)) {
    sqlContent = sqlContent.replace(regex, sqlInsert);
    fs.writeFileSync(sqlFile, sqlContent, 'utf8');
    console.log('Successfully updated setup.sql with ' + files.length + ' products (UTF-8 accented).');
}
