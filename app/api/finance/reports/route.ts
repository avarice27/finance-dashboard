import { NextResponse } from 'next/server';
import { 
  getReports, 
  createReport, 
  updateReport, 
  deleteReport,
  getFinancialOverview
} from '@/db/queries';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'overview') {
      const startDate = new Date(searchParams.get('startDate') || new Date().getFullYear(), 0, 1);
      const endDate = new Date(searchParams.get('endDate') || new Date());
      
      const overview = await getFinancialOverview(session.user.id, startDate, endDate);
      return NextResponse.json(overview);
    }

    const reports = await getReports(session.user.id);
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const newReport = await createReport({
      ...data,
      userId: session.user.id
    });
    return NextResponse.json(newReport[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    const updatedReport = await updateReport(id, updateData);
    return NextResponse.json(updatedReport[0]);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    const deletedReport = await deleteReport(parseInt(id));
    return NextResponse.json(deletedReport[0]);
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}