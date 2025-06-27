export const getStockfishNextMove = async (fen, depth) => {
    try {

        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${depth}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } 
    catch (error) 
    {
        console.error('Error fetching Stockfish move:', error);
        throw error;
    }
};