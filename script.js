// Supabase-ийн мэдээллүүд (Dashboard-аасаа хуулж авна)
const supabaseUrl = 'https://таны-төслийн-id.supabase.co';
const supabaseKey = 'таны-нийтэд-нээлттэй-anon-түлхүүр';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase холбогдоход бэлэн боллоо!");

// Жишээ: Өгөгдлийн сангаас мэдээлэл унших функц
async function fetchItems() {
    const { data, error } = await _supabase
        .from('барааны_хүснэгтийн_нэр')
        .select('*');
    
    if (error) {
        console.error('Алдаа гарлаа:', error);
    } else {
        console.log('Дата амжилттай ирлээ:', data);
    }
}

