import { NextRequest, NextResponse } from 'next/server';
import { leaderboardStore, LeaderboardEntry } from '@/lib/server/store';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = Math.min(100, Math.max(1, parseInt(limitParam || '30', 10) || 30));
    const sorted = [...leaderboardStore].sort((a, b) => b.xp - a.xp).slice(0, limit);
    return NextResponse.json({
      success: true,
      count: sorted.length,
      players: sorted,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب لوحة الصدارة' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, xp, avatar, rankIcon, rankTitle, coins, equippedTitle, casesSolved } = body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'اسم المحقق مطلوب' },
        { status: 400 }
      );
    }

    const validXp = Math.max(0, parseInt(xp, 10) || 0);
    const cleanUsername = username.trim().slice(0, 30);

    const existingIndex = leaderboardStore.findIndex(
      (p) => p.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    const entry: LeaderboardEntry = {
      id: existingIndex >= 0 ? leaderboardStore[existingIndex].id : 'player_' + Date.now(),
      username: cleanUsername,
      avatar: avatar || '🕵️‍♂️',
      equippedTitle: equippedTitle || 'مفتش مستجد',
      rankTitle: rankTitle || 'متدرب مبتدئ',
      rankIcon: rankIcon || 'Search',
      xp: validXp,
      coins: Math.max(0, parseInt(coins, 10) || 0),
      casesSolved: Math.max(0, parseInt(casesSolved, 10) || 0),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      leaderboardStore[existingIndex] = entry;
    } else {
      leaderboardStore.push(entry);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث لوحة الصدارة بنجاح',
      entry,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'فشل حفظ النتيجة' },
      { status: 500 }
    );
  }
}
