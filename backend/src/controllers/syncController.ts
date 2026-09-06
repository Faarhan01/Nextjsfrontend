import { Request, Response } from 'express';
import { dbManager } from '../services/dbManager.ts';

export function getSyncStatus(req: Request, res: Response): void {
  try {
    if (req.query.download === 'true' || req.query.export === 'true') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="db.json"');
      res.send(JSON.stringify(dbManager.getDb(), null, 2));
      return;
    }
    const status = dbManager.getSyncStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve sync status', message: err?.message });
  }
}

export function performSyncAction(req: Request, res: Response): void {
  try {
    const { action, database } = req.body || {};

    if (action === 'reload') {
      const result = dbManager.reloadFromDisk();
      res.json(result);
      return;
    }

    if (action === 'save') {
      dbManager.persistToDiskSync();
      res.json({
        success: true,
        message: 'Database persisted to data/db.json successfully.',
        status: dbManager.getSyncStatus()
      });
      return;
    }

    if (action === 'import') {
      const payload = database || req.body;
      const result = dbManager.importDatabase(payload);
      res.json({
        ...result,
        status: dbManager.getSyncStatus()
      });
      return;
    }

    if (action === 'export') {
      res.json({
        success: true,
        database: dbManager.getDb(),
        status: dbManager.getSyncStatus()
      });
      return;
    }

    res.status(400).json({
      error: 'Invalid action',
      supportedActions: ['reload', 'save', 'import', 'export']
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Sync action failed', message: err?.message });
  }
}
